"""Tests for import_photos.py. Run: uv run --with pillow --with pytest pytest scripts/photos"""

import json

import import_photos as ip
import pytest
from PIL import Image, ImageCms

XMP = (
    b'<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
    b'<rdf:Description xmlns:exif="http://ns.adobe.com/exif/1.0/" exif:GPSLatitude="14,30.07N"/>'
    b"</rdf:RDF></x:xmpmeta>"
)


def make_photo(path, size=(3000, 2000), orientation=None, gps=True):
    exif = Image.Exif()
    exif[ip.MAKE] = "FUJIFILM"
    exif[ip.MODEL] = "X-E5"
    if orientation:
        exif[0x0112] = orientation
    exif[ip.EXIF_IFD] = {
        ip.F_NUMBER: 2.8,
        ip.EXPOSURE_TIME: 1 / 250,
        ip.ISO: 160,
        ip.FOCAL_LENGTH: 23.0,
        ip.FOCAL_35MM: 35,
        ip.LENS_MODEL: "XF23mmF2.8 R WR   ",
        ip.DATE_TAKEN: "2026:02:21 19:40:11",
    }
    if gps:
        exif[ip.GPS_IFD] = {1: "N", 2: (14.0, 30.0, 4.0), 3: "W", 4: (90.0, 52.0, 33.0), 5: b"\x00", 6: 3976.0}
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
    Image.new("RGB", size, (120, 90, 200)).save(path, "JPEG", exif=exif, icc_profile=srgb, xmp=XMP)


def write_config(path, body):
    path.write_text(body, encoding="utf-8")
    return path


def test_dms_to_deg():
    assert ip.dms_to_deg((14, 30, 4), "N") == pytest.approx(14.50111, abs=1e-5)
    assert ip.dms_to_deg((90, 52, 33), "W") == pytest.approx(-90.87583, abs=1e-5)
    assert ip.dms_to_deg(None, "N") is None


@pytest.mark.parametrize(("seconds", "text"), [(1 / 250, "1/250 s"), (1 / 3, "1/3 s"), (0.5, "0.5 s"), (15, "15 s")])
def test_fmt_shutter(seconds, text):
    assert ip.fmt_shutter(seconds) == text


def test_formatters():
    assert ip.fmt_camera("FUJIFILM", "X-E5") == "Fujifilm X-E5"
    assert ip.fmt_camera("Apple", "iPhone 15 Pro") == "iPhone 15 Pro"
    assert ip.fmt_camera("Canon", "Canon EOS R6") == "Canon EOS R6"
    assert ip.fmt_camera(None, None) is None
    assert ip.fmt_elevation(3976, approx=False) == "3,976 m · 13,045 ft"
    assert ip.fmt_elevation(-2.4, approx=True) == "≈ -2 m · -8 ft"
    assert ip.fmt_elevation(3976, approx=True, short=True) == "≈ 3,976 m"
    assert ip.fmt_date("2026:02:21 19:40:11") == "21 Feb 2026"
    assert ip.fmt_date(None) is None


def test_import_strips_metadata_and_uses_gps(tmp_path):
    src, site = tmp_path / "originals", tmp_path / "site"
    src.mkdir()
    make_photo(src / "A.jpg", orientation=6)  # stored landscape, displayed portrait
    cfg = write_config(
        tmp_path / "photos.toml",
        """
[[photo]]
file = "A.jpg"
caption = "Me on the summit of Acatenango"
place = "Acatenango, Guatemala"
lat = 1.0
lon = 2.0
elevation_m = 100

[[photo]]
file = ""
caption = "Not here yet"
""",
    )
    records = ip.import_photos(src, config=cfg, site=site, elevations=None)

    assert len(records) == 1
    r = records[0]
    assert r["id"] == "a"
    assert r["height"] == 2048 and r["width"] < r["height"]
    assert r["thumbWidth"] == 720
    # The photo's own GPS wins over photos.toml
    assert (r["lat"], r["lon"]) == (14.501, -90.876)
    assert r["elevation"] == "3,976 m · 13,045 ft"
    assert r["elevationShort"] == "3,976 m"
    assert r["camera"] == "Fujifilm X-E5 · XF23mmF2.8 R WR"
    assert r["exposure"] == "23 mm (35 mm equiv.) · f/2.8 · 1/250 s · ISO 160"
    assert r["date"] == "21 Feb 2026"
    assert json.loads((site / "src/data/photos.json").read_text(encoding="utf-8")) == records

    for out in (site / "public/photos/a.jpg", site / "public/photos/thumbs/a.jpg"):
        with Image.open(out) as img:
            assert len(img.getexif()) == 0
            assert "xmp" not in img.info
            assert img.info.get("icc_profile")
        assert b"GPS" not in out.read_bytes()


def test_fallbacks_from_config_and_lookup(tmp_path):
    src, site = tmp_path / "originals", tmp_path / "site"
    src.mkdir()
    for name in ("b.jpg", "c.jpg", "d.jpg"):
        make_photo(src / name, size=(800, 600), gps=False)
    cfg = write_config(
        tmp_path / "photos.toml",
        """
[[photo]]
file = "b.jpg"
caption = "Summit"
lat = 32.759
lon = -16.9431
elevation_m = 1862

[[photo]]
file = "c.jpg"
caption = "Looked up"
lat = -13.1631
lon = -72.545

[[photo]]
file = "d.jpg"
caption = "Nowhere"
""",
    )
    asked = []

    def fake_lookup(points):
        asked.extend(points)
        return [1234.4]

    b, c, d = ip.import_photos(src, config=cfg, site=site, elevations=fake_lookup)

    assert (b["lat"], b["lon"], b["elevation"]) == (32.759, -16.943, "≈ 1,862 m · 6,109 ft")
    assert asked == [(-13.1631, -72.545)]
    assert c["elevation"] == "≈ 1,234 m · 4,050 ft"
    assert (d["lat"], d["lon"], d["elevation"]) == (None, None, None)


def test_lookup_failure_leaves_elevation_empty(tmp_path):
    src, site = tmp_path / "originals", tmp_path / "site"
    src.mkdir()
    make_photo(src / "e.jpg", size=(800, 600), gps=False)
    cfg = write_config(tmp_path / "photos.toml", '[[photo]]\nfile = "e.jpg"\ncaption = "x"\nlat = 1.0\nlon = 2.0\n')

    def offline(points):
        raise OSError("no network")

    (e,) = ip.import_photos(src, config=cfg, site=site, elevations=offline)
    assert e["elevation"] is None


def test_removes_stale_outputs_and_rejects_duplicates(tmp_path):
    src, site = tmp_path / "originals", tmp_path / "site"
    src.mkdir()
    make_photo(src / "f.jpg", size=(800, 600))
    (site / "public/photos/thumbs").mkdir(parents=True)
    for stale in (site / "public/photos/old.jpg", site / "public/photos/thumbs/old.jpg"):
        stale.write_bytes(b"x")
    cfg = write_config(tmp_path / "photos.toml", '[[photo]]\nfile = "f.jpg"\ncaption = "x"\n')
    ip.import_photos(src, config=cfg, site=site, elevations=None)
    assert sorted(p.name for p in (site / "public/photos").rglob("*.jpg")) == ["f.jpg", "f.jpg"]

    dup = write_config(tmp_path / "dup.toml", '[[photo]]\nfile = "f.jpg"\ncaption = "x"\n' * 2)
    with pytest.raises(SystemExit, match="duplicate id"):
        ip.import_photos(src, config=dup, site=site, elevations=None)
