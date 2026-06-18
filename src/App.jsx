import { useEffect } from 'react'
import { useEditor } from './context/EditorContext'
import TitleBar from './components/TitleBar'
import ActivityBar from './components/ActivityBar'
import FileExplorer from './components/FileExplorer'
import EditorArea from './components/EditorArea'
import StatusBar from './components/StatusBar'

export default function App() {
  const { sidebarOpen, toggleSidebar } = useEditor()

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  return (
    <div className="flex flex-col h-screen bg-lavender-bg overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden relative">
        <ActivityBar />
        {sidebarOpen && <FileExplorer />}
        <EditorArea />
      </div>
      <StatusBar />
    </div>
  )
}
