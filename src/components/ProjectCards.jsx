import { useEditor } from '../context/EditorContext'

// <project-cards> in a content file: a grid of <project-card> tiles
export default function ProjectCards({ children }) {
  return <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{children}</div>
}

// <project-card path="projects/x.md" image="/images/..." title="X" cta="Optional button text">One line</project-card>
export function ProjectCard({ path, image, title, cta, children }) {
  const { openFile } = useEditor()
  return (
    <button
      onClick={() => openFile(path)}
      className="group flex flex-col justify-start text-left rounded border border-lavender-border overflow-hidden bg-lavender-sidebar hover:border-lavender-tabBorder transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-tabBorder"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="block w-full aspect-[3/2] object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        {/* Sits on the thumbnail so it adds no height. A span, not a link: the whole card is already the button */}
        {cta && (
          <span className="absolute left-2 bottom-2 rounded px-2 py-1 text-xs font-bold text-white bg-lavender-tabBorder shadow-md group-hover:bg-lavender-accent transition-colors">
            {cta}
          </span>
        )}
      </div>
      <span className="block px-3 pt-2 text-sm font-bold text-lavender-accent">{title}</span>
      <span className="block px-3 pb-2.5 text-sm leading-snug text-lavender-muted">{children}</span>
    </button>
  )
}
