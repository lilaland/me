import { createContext, useContext, useState } from 'react'

const EditorContext = createContext()

export function EditorProvider({ children }) {
  const [openFiles, setOpenFiles] = useState(['README.md'])
  const [activeFile, setActiveFile] = useState('README.md')
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === 'undefined' || window.innerWidth >= 768
  )

  function openFile(path) {
    if (!openFiles.includes(path)) setOpenFiles(prev => [...prev, path])
    setActiveFile(path)
  }

  function closeFile(path) {
    const next = openFiles.filter(f => f !== path)
    setOpenFiles(next)
    if (activeFile === path) setActiveFile(next[next.length - 1] ?? null)
  }

  return (
    <EditorContext.Provider value={{
      openFiles, activeFile, sidebarOpen,
      openFile, closeFile, setActiveFile,
      toggleSidebar: () => setSidebarOpen(v => !v),
      closeSidebar: () => setSidebarOpen(false)
    }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => useContext(EditorContext)
