import { useEditor } from '../context/EditorContext'

function FilesIcon({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4C3 2.89543 3.89543 2 5 2H14L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M14 2V9H21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ActivityBar() {
  const { toggleSidebar, sidebarOpen } = useEditor()

  return (
    <div className="flex flex-col items-center py-3 gap-4 bg-lavender-sidebar border-r border-lavender-border" style={{ width: '48px', flexShrink: 0 }}>
      <button
        onClick={toggleSidebar}
        className={`p-1.5 rounded transition-colors ${sidebarOpen ? 'text-lavender-accent' : 'text-lavender-muted hover:text-lavender-accent'}`}
        title="Explorer (Ctrl+B)"
      >
        <FilesIcon className="w-6 h-6" />
      </button>
    </div>
  )
}
