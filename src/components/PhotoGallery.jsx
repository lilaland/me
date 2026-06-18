import { useState } from 'react'
import { photoFolders } from '../data/photoFolders'

export default function PhotoGallery() {
  const [lightbox, setLightbox] = useState(null)

  if (!photoFolders || photoFolders.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-lavender-muted text-sm">
        <div className="text-center">
          <p>Drop photos into <code className="bg-lavender-border px-1 rounded">public/photos/</code></p>
          <p className="mt-2">Add folder names to <code className="bg-lavender-border px-1 rounded">src/data/photoFolders.js</code></p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {photoFolders.map(folder => (
        <div key={folder.name} className="mb-8">
          <h2 className="text-lavender-accent font-bold text-lg mb-4">{folder.name}</h2>
          <div className="columns-3 gap-2">
            {folder.images.map((img, i) => (
              <img
                key={i}
                src={`/photos/${folder.name}/${img}`}
                alt={img}
                className="w-full rounded mb-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => setLightbox({ folder: folder.name, img })}
              />
            ))}
          </div>
        </div>
      ))}

      {lightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setLightbox(null)}
          onKeyDown={e => e.key === 'Escape' && setLightbox(null)}
        >
          <img
            src={`/photos/${lightbox.folder}/${lightbox.img}`}
            alt={lightbox.img}
            className="max-w-4xl max-h-screen rounded shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
