import { useEffect } from 'react'

function Detail({ label, children }) {
  if (!children) return null
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-lavender-muted">{label}</dt>
      <dd className="text-sm text-lavender-text mt-0.5">{children}</dd>
    </div>
  )
}

function StepButton({ dir, onStep }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onStep(dir) }}
      aria-label={dir < 0 ? 'Previous photo' : 'Next photo'}
      className={`absolute top-1/2 -translate-y-1/2 ${dir < 0 ? 'left-2' : 'right-2'} w-9 h-9 rounded-full bg-black/40 text-white text-xl leading-none hover:bg-black/60 transition-colors`}
    >
      {dir < 0 ? '‹' : '›'}
    </button>
  )
}

export default function PhotoLightbox({ photos, index, onClose, onStep, onShowOnMap }) {
  const photo = photos[index]

  // Hand focus back to whatever opened the lightbox
  useEffect(() => {
    const opener = document.activeElement
    return () => opener?.focus?.()
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  // Preload the neighbours so stepping through is instant
  useEffect(() => {
    for (const dir of [1, -1]) new Image().src = photos[(index + dir + photos.length) % photos.length].src
  }, [photos, index])

  const onMap = photo.lat != null && photo.lon != null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      className="fixed inset-0 z-50 flex flex-col md:flex-row bg-[#140f24]/95"
      onClick={onClose}
    >
      <div className="relative flex-1 min-h-0 flex items-center justify-center p-3 md:p-8">
        <img
          key={photo.id}
          src={photo.src}
          alt={photo.caption}
          width={photo.width}
          height={photo.height}
          className="max-w-full max-h-full w-auto h-auto object-contain rounded shadow-2xl"
          onClick={e => e.stopPropagation()}
        />
        {photos.length > 1 && (
          <>
            <StepButton dir={-1} onStep={onStep} />
            <StepButton dir={1} onStep={onStep} />
          </>
        )}
      </div>

      <aside
        className="md:w-80 shrink-0 max-h-[42vh] md:max-h-none overflow-y-auto bg-lavender-bg border-t md:border-t-0 md:border-l border-lavender-border p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-lavender-muted">{index + 1} / {photos.length}</span>
          <button
            autoFocus
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded text-lavender-muted hover:text-lavender-text hover:bg-lavender-hover text-lg leading-none"
          >
            ×
          </button>
        </div>
        <h2 className="text-lavender-accent font-bold mt-2 leading-snug">{photo.caption}</h2>
        <dl className="mt-4 space-y-3">
          <Detail label="Place">{photo.place}</Detail>
          <Detail label="Elevation">{photo.elevation}</Detail>
          <Detail label="Taken">{photo.date}</Detail>
          <Detail label="Camera">{photo.camera}</Detail>
          <Detail label="Exposure">{photo.exposure}</Detail>
        </dl>
        {onMap && (
          <button
            onClick={() => onShowOnMap(photo.id)}
            className="mt-5 px-3 py-1.5 text-xs rounded border border-lavender-border text-lavender-keyword hover:bg-lavender-hover transition-colors"
          >
            Show on map
          </button>
        )}
      </aside>
    </div>
  )
}
