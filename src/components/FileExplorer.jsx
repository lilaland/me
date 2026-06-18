import { useEditor } from '../context/EditorContext'
import { fileTree } from '../data/fileTree'
import FileTreeItem from './FileTreeItem'

export default function FileExplorer() {
  const { openFile, activeFile, closeSidebar } = useEditor()

  function handleFileClick(path) {
    openFile(path)
    // On mobile the explorer overlays the content, so collapse it once a file is picked
    if (typeof window !== 'undefined' && window.innerWidth < 768) closeSidebar()
  }

  return (
    <>
      {/* Dim + tap-to-dismiss layer — mobile only, where the explorer overlays the editor */}
      <div
        className="absolute inset-y-0 left-12 right-0 z-20 bg-lavender-text/30 md:hidden"
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <div
        className="flex flex-col bg-lavender-sidebar border-r border-lavender-border overflow-y-auto absolute inset-y-0 left-12 z-30 md:static md:left-auto md:z-auto"
        style={{ width: '240px', flexShrink: 0 }}
      >
        <div className="px-4 py-2 text-xs tracking-widest text-lavender-muted uppercase select-none">
          Explorer
        </div>
        <div>
          {fileTree.map(item => (
            <FileTreeItem
              key={item.name}
              item={item}
              depth={0}
              activeFile={activeFile}
              onFileClick={handleFileClick}
            />
          ))}
        </div>
      </div>
    </>
  )
}
