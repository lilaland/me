import { useEditor } from '../context/EditorContext'

export default function Breadcrumb() {
  const { activeFile } = useEditor()

  if (!activeFile) return <span />

  const parts = activeFile.split('/')

  return (
    <span className="flex items-center text-xs text-lavender-muted">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && <span className="mx-1.5 text-lavender-border">›</span>}
          <span className={i === parts.length - 1 ? 'text-lavender-text' : ''}>
            {part}
          </span>
        </span>
      ))}
    </span>
  )
}
