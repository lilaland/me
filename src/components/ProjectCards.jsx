import { useEditor } from '../context/EditorContext'

// <project-cards> in a content file: a grid of <project-card> tiles
export default function ProjectCards({ children }) {
  return <div className="grid sm:grid-cols-2 gap-4 mb-6">{children}</div>
}

// <project-card path="projects/x.md" image="/images/..." title="X">One line</project-card>
export function ProjectCard({ path, image, title, children }) {
  const { openFile } = useEditor()
  return (
    <button
      onClick={() => openFile(path)}
      className="group block text-left rounded border border-lavender-border overflow-hidden bg-lavender-sidebar hover:border-lavender-tabBorder transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-tabBorder"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="block w-full aspect-[3/2] object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>
      <span className="block px-3 pt-2 text-sm font-bold text-lavender-accent">{title}</span>
      <span className="block px-3 pb-2.5 text-xs leading-snug text-lavender-muted">{children}</span>
    </button>
  )
}
