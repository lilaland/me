import { useEditor } from '../context/EditorContext'
import photos from '../data/photos.json'

// <photo-previews count="4"> in a content file: the first few photos, linking to the gallery
export default function PhotoPreviews({ count = 4 }) {
  const { openFile } = useEditor()
  const shown = photos.slice(0, Number(count))
  if (shown.length === 0) return null

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shown.map(photo => (
          <figure key={photo.id}>
            <button
              onClick={() => openFile('photos')}
              aria-label={`Open photos: ${photo.caption}`}
              className="block w-full rounded overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-tabBorder"
            >
              <img
                src={photo.thumb}
                alt={photo.caption}
                loading="lazy"
                className="block w-full aspect-[4/3] object-cover hover:scale-[1.03] transition-transform duration-300"
              />
            </button>
            <figcaption className="mt-1 text-xs leading-snug text-lavender-muted">{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <button
        onClick={() => openFile('photos')}
        className="mt-3 text-sm text-lavender-keyword underline decoration-dotted hover:decoration-solid"
      >
        See all {photos.length} photos →
      </button>
    </div>
  )
}
