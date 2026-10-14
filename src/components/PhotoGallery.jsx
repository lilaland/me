import { lazy, Suspense, useCallback, useState } from 'react'
import photos from '../data/photos.json'
import PhotoLightbox from './PhotoLightbox'

// Leaflet only loads when someone opens the map
const PhotoMap = lazy(() => import('./PhotoMap'))

const VIEWS = [
  ['grid', 'Grid'],
  ['map', 'Map'],
]

export default function PhotoGallery() {
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
          <div className="columns-2 lg:columns-3 gap-4">
            {photos.map((photo, i) => (
              <figure key={photo.id} className="break-inside-avoid mb-5">
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
