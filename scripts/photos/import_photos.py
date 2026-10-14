# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow>=10.3", "pillow-heif>=0.16"]
# ///
"""Import the photos listed in photos.toml into the site's photos view.

    uv run scripts/photos/import_photos.py "~/Documents/lila site photos"

For each [[photo]] entry this reads the original from the given folder and
writes two copies under public/photos/: one at most 2048 px on its long edge
and a 720 px wide thumbnail. Both are re-encoded with no EXIF, XMP or GPS data
(the colour profile is kept). The caption, place, coordinates, elevation and
camera details go into src/data/photos.json, which the gallery and map read.

Where values come from:
- caption and place: photos.toml
- coordinates: the photo's GPS, else lat/lon in photos.toml. Published
  rounded to 3 decimal places (about 100 m)
- elevation: the photo's GPS altitude, else elevation_m in photos.toml, else a
  terrain lookup at the coordinates (OpenTopoData). The last two show "≈"
- camera, lens, exposure and date: the photo's EXIF

Tests: uv run --with pillow --with pytest pytest scripts/photos
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
import time
import tomllib
import urllib.request
from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageOps

try:  # iPhone photos are HEIC
    from pillow_heif import register_heif_opener
except ImportError:
    pass
else:
    register_heif_opener()

ROOT = Path(__file__).resolve().parents[2]
CONFIG = Path(__file__).with_name("photos.toml")
FULL_EDGE = 2048
THUMB_WIDTH = 720
QUALITY = 82
COORD_DECIMALS = 3
ELEVATION_API = "https://api.opentopodata.org/v1/mapzen?locations={}"

# EXIF tags
MAKE, MODEL = 0x010F, 0x0110
EXIF_IFD, GPS_IFD = 0x8769, 0x8825
EXPOSURE_TIME, F_NUMBER, ISO = 0x829A, 0x829D, 0x8827
DATE_TAKEN, FOCAL_LENGTH, FOCAL_35MM, LENS_MODEL = 0x9003, 0x920A, 0xA405, 0xA434
GPS_LAT_REF, GPS_LAT, GPS_LON_REF, GPS_LON, GPS_ALT_REF, GPS_ALT = 1, 2, 3, 4, 5, 6

MAKES = {
    "FUJIFILM": "Fujifilm",
    "SONY": "Sony",
    "NIKON CORPORATION": "Nikon",
    "OLYMPUS CORPORATION": "Olympus",
    "LEICA CAMERA AG": "Leica",
    "samsung": "Samsung",
}

ElevationLookup = Callable[[list[tuple[float, float]]], list[float | None]]


@dataclass
class Meta:
    make: str | None = None
    model: str | None = None
    lens: str | None = None
    focal: float | None = None
    focal35: int | None = None
    fnumber: float | None = None
    exposure: float | None = None
    iso: int | None = None
    taken: str | None = None  # EXIF format, "YYYY:MM:DD HH:MM:SS"
    lat: float | None = None
    lon: float | None = None
    alt: float | None = None


def _text(value) -> str | None:
    if isinstance(value, bytes):
        value = value.decode("utf-8", "replace")
    if not isinstance(value, str):
        return None
    return value.strip("\x00 \t\r\n") or None


def _num(value) -> float | None:
    if isinstance(value, tuple):  # some cameras store ISO as a tuple
        value = value[0] if value else None
    try:
        f = float(value)
    except (TypeError, ValueError, ZeroDivisionError):
        return None
    return f if math.isfinite(f) else None


def dms_to_deg(dms, ref) -> float | None:
    """GPS degrees/minutes/seconds to signed decimal degrees."""
    try:
        d, m, s = (float(x) for x in dms)
    except (TypeError, ValueError, ZeroDivisionError):
        return None
    deg = d + m / 60 + s / 3600
    if not math.isfinite(deg):
        return None
    return -deg if _text(ref) in ("S", "W") else deg


def read_meta(img: Image.Image) -> Meta:
    exif = img.getexif()
    sub = exif.get_ifd(EXIF_IFD)
    gps = exif.get_ifd(GPS_IFD)
    iso = _num(sub.get(ISO))
    focal35 = _num(sub.get(FOCAL_35MM))
    meta = Meta(
        make=_text(exif.get(MAKE)),
        model=_text(exif.get(MODEL)),
        lens=_text(sub.get(LENS_MODEL)),
        focal=_num(sub.get(FOCAL_LENGTH)),
        focal35=round(focal35) if focal35 else None,
        fnumber=_num(sub.get(F_NUMBER)),
        exposure=_num(sub.get(EXPOSURE_TIME)),
        iso=round(iso) if iso else None,
        taken=_text(sub.get(DATE_TAKEN)),
    )
    lat = dms_to_deg(gps.get(GPS_LAT), gps.get(GPS_LAT_REF))
    lon = dms_to_deg(gps.get(GPS_LON), gps.get(GPS_LON_REF))
    if lat is not None and lon is not None and (lat, lon) != (0.0, 0.0):
        meta.lat, meta.lon = lat, lon
    alt = _num(gps.get(GPS_ALT))
    if alt is not None:
        meta.alt = -alt if gps.get(GPS_ALT_REF) in (1, b"\x01") else alt
    return meta


def fmt_camera(make: str | None, model: str | None) -> str | None:
    make = MAKES.get(make, make) if make else None
    if not model:
        return make
    if not make or make == "Apple" or model.lower().startswith(make.lower()):
        return model
    return f"{make} {model}"


def fmt_shutter(seconds: float) -> str:
    if seconds >= 0.4:
        return f"{round(seconds, 1):g} s"
    return f"1/{round(1 / seconds)} s"


def fmt_exposure(meta: Meta) -> str | None:
    parts = []
    if meta.focal:
        focal = f"{round(meta.focal, 1):g} mm"
        if meta.focal35 and abs(meta.focal35 - meta.focal) > 1:
            focal += f" ({meta.focal35} mm equiv.)"
        parts.append(focal)
    if meta.fnumber:
        parts.append(f"f/{round(meta.fnumber, 1):g}")
    if meta.exposure:
        parts.append(fmt_shutter(meta.exposure))
    if meta.iso:
        parts.append(f"ISO {meta.iso}")
    return " · ".join(parts) or None


def fmt_elevation(metres: float, approx: bool, short: bool = False) -> str:
    text = f"{'≈ ' if approx else ''}{round(metres):,} m"
    return text if short else f"{text} · {round(metres * 3.28084):,} ft"


def _set_elevation(record: dict, metres: float, approx: bool) -> None:
    record["elevation"] = fmt_elevation(metres, approx)
    record["elevationShort"] = fmt_elevation(metres, approx, short=True)


def fmt_date(taken: str | None) -> str | None:
    try:
        d = datetime.strptime((taken or "")[:19], "%Y:%m:%d %H:%M:%S")
    except ValueError:
        return None
    return f"{d.day} {d:%b %Y}"


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def lookup_elevations(points: list[tuple[float, float]]) -> list[float | None]:
    """Terrain elevation in metres for each (lat, lon), from OpenTopoData."""
    out: list[float | None] = []
    for i in range(0, len(points), 100):  # the API takes at most 100 points per call
        if i:
            time.sleep(1.1)  # and one call per second
        locs = "|".join(f"{lat:.5f},{lon:.5f}" for lat, lon in points[i : i + 100])
        req = urllib.request.Request(ELEVATION_API.format(locs), headers={"User-Agent": "lila-site-photos"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            out += [_num(r.get("elevation")) for r in json.load(resp)["results"]]
    return out


def _save(img: Image.Image, path: Path, icc: bytes | None) -> None:
    img.info = {}  # never carry EXIF or XMP from the original
    extra = {"icc_profile": icc} if icc else {}
    img.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True, **extra)


def import_photos(
    src: Path,
    config: Path = CONFIG,
    site: Path = ROOT,
    elevations: ElevationLookup | None = lookup_elevations,
) -> list[dict]:
    entries = tomllib.loads(config.read_text(encoding="utf-8")).get("photo", [])
    full_dir = site / "public" / "photos"
    thumb_dir = full_dir / "thumbs"
    thumb_dir.mkdir(parents=True, exist_ok=True)

    records: list[dict] = []
    needs_lookup: list[tuple[dict, float, float]] = []
    sources: dict[str, dict[str, str]] = {}
    for n, entry in enumerate(entries, 1):
        if not entry.get("file"):
            print(f"#{n} skipped, no file yet: {entry.get('caption', '')}", file=sys.stderr)
            continue
        pid = entry.get("id") or slugify(Path(entry["file"]).stem)
        if any(r["id"] == pid for r in records):
            raise SystemExit(f"#{n}: duplicate id {pid!r}; set a distinct id in photos.toml")

        with Image.open(src / entry["file"]) as original:
            meta = read_meta(original)
            # A CMYK or greyscale profile would be wrong once converted to RGB
            icc = original.info.get("icc_profile") if original.mode in ("RGB", "RGBA") else None
            full = ImageOps.exif_transpose(original).convert("RGB")
        full.thumbnail((FULL_EDGE, FULL_EDGE), Image.Resampling.LANCZOS)
        thumb = full.copy()
        thumb.thumbnail((THUMB_WIDTH, thumb.height), Image.Resampling.LANCZOS)
        _save(full, full_dir / f"{pid}.jpg", icc)
        _save(thumb, thumb_dir / f"{pid}.jpg", icc)

        lat, lon, where = meta.lat, meta.lon, "gps"
        if lat is None and "lat" in entry and "lon" in entry:
            lat, lon, where = float(entry["lat"]), float(entry["lon"]), "photos.toml"
        if lat is None:
            where = "none"
        record = {
            "id": pid,
            "src": f"/photos/{pid}.jpg",
            "thumb": f"/photos/thumbs/{pid}.jpg",
            "width": full.width,
            "height": full.height,
            "thumbWidth": thumb.width,
            "thumbHeight": thumb.height,
            "caption": entry["caption"],
            "place": entry.get("place"),
            "lat": round(lat, COORD_DECIMALS) if lat is not None else None,
            "lon": round(lon, COORD_DECIMALS) if lon is not None else None,
            "elevation": None,
            "elevationShort": None,
            "date": fmt_date(meta.taken),
            "camera": " · ".join(filter(None, [fmt_camera(meta.make, meta.model), _lens(meta)])) or None,
            "exposure": fmt_exposure(meta),
        }
        if meta.alt is not None:
            _set_elevation(record, meta.alt, approx=False)
            height_from = "gps"
        elif "elevation_m" in entry:
            _set_elevation(record, float(entry["elevation_m"]), approx=True)
            height_from = "photos.toml"
        elif lat is not None and elevations:
            needs_lookup.append((record, lat, lon))
            height_from = "lookup"
        else:
            height_from = "none"
        sources[pid] = {"location": where, "elevation": height_from}
        records.append(record)

    if needs_lookup:
        try:
            heights = elevations([(lat, lon) for _, lat, lon in needs_lookup])
        except OSError as err:  # URLError and timeouts are OSErrors
            print(f"elevation lookup failed ({err}); those photos have no elevation", file=sys.stderr)
            heights = [None] * len(needs_lookup)
        for (record, _, _), metres in zip(needs_lookup, heights):
            if metres is not None:
                _set_elevation(record, metres, approx=True)
            else:
                sources[record["id"]]["elevation"] = "none"

    keep = {f"{r['id']}.jpg" for r in records}
    for folder in (full_dir, thumb_dir):
        for stale in folder.glob("*.jpg"):
            if stale.name not in keep:
                stale.unlink()

    manifest = site / "src" / "data" / "photos.json"
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for r in records:
        s = sources[r["id"]]
        print(f"{r['id']:<16} location: {s['location']:<11} elevation: {s['elevation']:<11} {r['caption']}")
    return records


def _lens(meta: Meta) -> str | None:
    # Phones repeat the model in the lens name ("iPhone 15 Pro back triple camera ..."); skip those.
    if meta.lens and meta.model and meta.lens.lower().startswith(meta.model.lower()):
        return None
    return meta.lens


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Import the photos listed in photos.toml into the site.")
    parser.add_argument("src", type=Path, help="folder with the original photos")
    parser.add_argument("--no-lookup", action="store_true", help="skip the terrain elevation lookup")
    args = parser.parse_args(argv)
    import_photos(args.src.expanduser(), elevations=None if args.no_lookup else lookup_elevations)


if __name__ == "__main__":
    main()
