import { useEditor } from '../context/EditorContext'
import { getFileLabel, getFileIcon } from '../data/fileTree'

function FileIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function TabBar() {
  const { openFiles, activeFile, setActiveFile, closeFile } = useEditor()

  if (openFiles.length === 0) return null

  return (
    <div className="flex overflow-x-auto bg-lavender-sidebar border-b border-lavender-border" style={{ flexShrink: 0 }}>
      {openFiles.map(path => {
        const isActive = path === activeFile
        const name = getFileLabel(path)
        const icon = getFileIcon(path)
        return (
          <div
            key={path}
            onClick={() => setActiveFile(path)}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm cursor-pointer border-r border-lavender-border shrink-0 group transition-colors ${
              isActive
                ? 'bg-lavender-bg text-lavender-text border-t-2 border-t-lavender-tabBorder'
                : 'bg-lavender-sidebar text-lavender-muted hover:bg-lavender-hover'
            }`}
          >
            <div className="relative shrink-0">
              <FileIcon />
              {icon && <span className="absolute -bottom-0.5 -right-0.5 text-[8px] leading-none">{icon}</span>}
            </div>
            <span>{name}</span>
            <button
              onClick={e => { e.stopPropagation(); closeFile(path) }}
              className="ml-1 text-xs opacity-0 group-hover:opacity-100 hover:text-lavender-text transition-opacity w-4 h-4 flex items-center justify-center rounded hover:bg-lavender-border"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
