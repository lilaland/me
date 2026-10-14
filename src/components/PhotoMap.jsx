import { useEffect, useRef } from 'react'
import L from '../lib/leaflet'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import './PhotoMap.css'

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// A round thumbnail; clusters show their first photo with a count badge
function thumbIcon(photo, count) {
  const el = document.createElement('div')
  const img = document.createElement('img')
  img.src = photo.thumb
  img.alt = ''
  el.append(img)
  if (count) {
    const badge = document.createElement('span')
    badge.textContent = count
    el.append(badge)
  }
  return L.divIcon({ html: el, className: count ? 'photo-cluster' : 'photo-marker', iconSize: [48, 48] })
}

function tooltip(photo) {
  const el = document.createElement('div')
  const caption = document.createElement('strong')
  caption.textContent = photo.caption
  el.append(caption)
  for (const line of [photo.place, photo.elevation]) {
    if (!line) continue
    const span = document.createElement('span')
    span.textContent = line
    el.append(span)
  }
  return el
}

export default function PhotoMap({ photos, focusId, onOpen }) {
  const container = useRef(null)
  const openRef = useRef(onOpen)
  openRef.current = onOpen

  useEffect(() => {
    const map = L.map(container.current, { worldCopyJump: true })
    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map)

    const markers = new Map()
    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 56,
      spiderfyDistanceMultiplier: 2.2,
      iconCreateFunction: group => {
        const first = group.getAllChildMarkers().sort((a, b) => a.options.order - b.options.order)[0]
        return thumbIcon(first.options.photo, group.getChildCount())
      },
    })
    photos.forEach((photo, order) => {
      if (photo.lat == null || photo.lon == null) return
      const marker = L.marker([photo.lat, photo.lon], {
        icon: thumbIcon(photo),
        title: photo.caption,
        alt: photo.caption,
        riseOnHover: true,
        photo,
        order,
      })
      marker.bindTooltip(tooltip(photo), { direction: 'top', offset: [0, -26], className: 'photo-tip' })
      marker.on('click', () => openRef.current(photo.id))
      markers.set(photo.id, marker)
      cluster.addLayer(marker)
    })
    map.addLayer(cluster)

    const focus = focusId && markers.get(focusId)
    if (focus) {
      map.setView(focus.getLatLng(), 13)
      cluster.zoomToShowLayer(focus, () => focus.openTooltip())
    } else if (markers.size) {
      map.fitBounds(cluster.getBounds(), { padding: [48, 48], maxZoom: 12 })
    } else {
      map.setView([20, 0], 2)
    }
    return () => map.remove()
  }, [photos, focusId])

  return <div ref={container} className="photo-map absolute inset-0 isolate" role="region" aria-label="Map of where the photos were taken" />
}
