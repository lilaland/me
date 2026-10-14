import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useEditor } from '../context/EditorContext'
import photos from '../data/photos.json'
import PhotoLightbox from './PhotoLightbox'

// Leaflet only loads when someone opens the map
const PhotoMap = lazy(() => import('./PhotoMap'))

const VIEWS = [
  ['grid', 'Grid'],
  ['map', 'Map'],
]

// Three columns from Tailwind's lg breakpoint up, two below
const WIDE = '(min-width: 1024px)'
// Rough height of a caption, as a share of the column width
const CAPTION = 0.25

function useColumnCount() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches)
  useEffect(() => {
    const query = window.matchMedia(WIDE)
    const onChange = e => setWide(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return wide ? 3 : 2
}

// Each photo goes into the shortest column so far, so photos.toml order reads
// left to right, row by row (CSS columns would fill top to bottom instead)
function toColumns(count) {
  const columns = Array.from({ length: count }, () => ({ height: 0, items: [] }))
  photos.forEach((photo, i) => {
    const shortest = columns.reduce((a, b) => (b.height < a.height ? b : a))
    shortest.items.push(i)
    shortest.height += photo.thumbHeight / photo.thumbWidth + CAPTION
  })
  return columns.map(c => c.items)
}

export default function PhotoGallery() {
  const columnCount = useColumnCount()
  const columns = useMemo(() => toColumns(columnCount), [columnCount])
  const [view, setView] = useState('grid')
  const [open, setOpen] = useState(null) // index of the photo in the lightbox
  const [focusId, setFocusId] = useState(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(dir => setOpen(i => (i + dir + photos.length) % photos.length), [])
  const openById = useCallback(id => setOpen(photos.findIndex(p => p.id === id)), [])
  const showOnMap = useCallback(id => {
    setOpen(null)
    setFocusId(id)
    setView('map')
  }, [])

  // A photo picked elsewhere (the home page previews) opens straight in the lightbox
  const { photoToOpen, clearPhotoToOpen } = useEditor()
  useEffect(() => {
    if (photoToOpen == null) return
    openById(photoToOpen)
    clearPhotoToOpen()
  }, [photoToOpen, openById, clearPhotoToOpen])

  if (photos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-lavender-muted text-sm">
        Photos coming soon.
      </div>
    )
  }

  const mapped = photos.filter(p => p.lat != null && p.lon != null).length

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-2 border-b border-lavender-border">
        <p className="text-xs text-lavender-muted">
          <span className="text-lavender-accent font-bold">{photos.length} photos</span>
          {mapped > 0 && ` · ${mapped} on the map`}
        </p>
        <div role="tablist" aria-label="Photo view" className="flex rounded border border-lavender-border overflow-hidden text-xs">
          {VIEWS.map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={view === key}
              onClick={() => {
                setFocusId(null)
                setView(key)
              }}
              className={`px-3 py-1 transition-colors ${
                view === key ? 'bg-lavender-active text-lavender-text' : 'text-lavender-muted hover:bg-lavender-hover'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-start gap-4">
            {columns.map((items, c) => (
              <div key={c} className="flex-1 min-w-0">
                {items.map(i => {
                  const photo = photos[i]
                  return (
                    <figure key={photo.id} className="mb-5">
                      <button
                        onClick={() => setOpen(i)}
                        aria-label={`Open ${photo.caption}`}
                        className="block w-full rounded overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-tabBorder"
                      >
                        <img
                          src={photo.thumb}
                          alt={photo.caption}
                          width={photo.thumbWidth}
                          height={photo.thumbHeight}
                          loading="lazy"
                          className="block w-full h-auto hover:scale-[1.03] transition-transform duration-300"
                        />
                      </button>
                      <figcaption className="mt-1.5 text-xs leading-snug">
                        <span className="block text-lavender-text">{photo.caption}</span>
                        <span className="block text-lavender-muted">
                          {[photo.place, photo.elevationShort].filter(Boolean).join(' · ')}
                        </span>
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex-1 min-h-0">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center text-lavender-muted text-sm">
                Loading map…
              </div>
            }
          >
            <PhotoMap photos={photos} focusId={focusId} onOpen={openById} />
          </Suspense>
        </div>
      )}

      {open != null && open >= 0 && (
        <PhotoLightbox photos={photos} index={open} onClose={close} onStep={step} onShowOnMap={showOnMap} />
      )}
    </div>
  )
}
