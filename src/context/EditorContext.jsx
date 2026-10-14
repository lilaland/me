import { createContext, useContext, useState } from 'react'

const EditorContext = createContext()

export function EditorProvider({ children }) {
  const [openFiles, setOpenFiles] = useState(['README.md'])
  const [activeFile, setActiveFile] = useState('README.md')
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === 'undefined' || window.innerWidth >= 768
  )
  // Id of a photo the gallery should show in its lightbox when it opens
  const [photoToOpen, setPhotoToOpen] = useState(null)

  function openFile(path) {
    if (!openFiles.includes(path)) setOpenFiles(prev => [...prev, path])
    setActiveFile(path)
  }

  function openPhoto(id) {
    openFile('photos')
    setPhotoToOpen(id)
  }

  function closeFile(path) {
    const next = openFiles.filter(f => f !== path)
    setOpenFiles(next)
    if (activeFile === path) setActiveFile(next[next.length - 1] ?? null)
  }

  return (
    <EditorContext.Provider value={{
      openFiles, activeFile, sidebarOpen, photoToOpen,
      openFile, closeFile, setActiveFile, openPhoto,
      clearPhotoToOpen: () => setPhotoToOpen(null),
      toggleSidebar: () => setSidebarOpen(v => !v),
      closeSidebar: () => setSidebarOpen(false)
    }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => useContext(EditorContext)
