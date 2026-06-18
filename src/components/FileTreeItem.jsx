import { useState } from 'react'

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 2V9H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FolderIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      {open
        ? <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
        : <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      }
    </svg>
  )
}

export default function FileTreeItem({ item, depth, activeFile, onFileClick }) {
  const defaultOpen = item.name === 'experience' || item.name === 'internships' || item.name === 'projects'
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const paddingLeft = `${depth * 14 + 8}px`

  if (item.type === 'file' || item.isGallery) {
    const isActive = activeFile === item.path
    return (
      <div
        style={{ paddingLeft }}
        className={`flex items-center gap-1.5 py-0.5 pr-2 text-sm cursor-pointer select-none transition-colors ${
          isActive
            ? 'bg-lavender-active text-lavender-text'
            : 'text-lavender-muted hover:bg-lavender-hover hover:text-lavender-text'
        }`}
        onClick={() => onFileClick(item.path)}
      >
        <div className="relative shrink-0">
          <FileIcon />
          {item.icon && <span className="absolute -bottom-0.5 -right-0.5 text-[8px] leading-none">{item.icon}</span>}
        </div>
        <span className="truncate">{item.label || item.name}</span>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{ paddingLeft }}
        className="flex items-center gap-1.5 py-0.5 pr-2 text-sm cursor-pointer select-none text-lavender-muted hover:bg-lavender-hover hover:text-lavender-text transition-colors"
        onClick={() => setIsOpen(v => !v)}
      >
        <span className="text-xs w-3 text-center">{isOpen ? '▾' : '▸'}</span>
        <FolderIcon open={isOpen} />
        <span className="truncate">{item.name}</span>
      </div>
      {isOpen && item.children && (
        <div>
          {item.children.map(child => (
            <FileTreeItem
              key={child.name}
              item={child}
              depth={depth + 1}
              activeFile={activeFile}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
