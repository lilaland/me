import { useState, useEffect, useRef } from 'react'
import { useEditor } from '../context/EditorContext'
import TabBar from './TabBar'
import Breadcrumb from './Breadcrumb'
import MarkdownViewer from './MarkdownViewer'
import GBAEmulator from './GBAEmulator'
import PhotoGallery from './PhotoGallery'
import PetCanvas from './PetCanvas'

function ViewToggle({ raw, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={raw ? 'Show preview' : 'Show source'}
      className="flex items-center gap-1 px-2 py-0.5 text-xs rounded text-lavender-muted hover:text-lavender-text hover:bg-lavender-hover transition-colors"
    >
      {raw ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          Source
        </>
      )}
    </button>
  )
}

export default function EditorArea() {
  const { activeFile } = useEditor()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [raw, setRaw] = useState(false)
  const [editorWidth, setEditorWidth] = useState(600)
  const contentRef = useRef(null)

  useEffect(() => {
    setRaw(false)
    if (!activeFile || activeFile === 'photos' || !activeFile.endsWith('.md')) {
      setContent('')
      return
    }

    setLoading(true)
    setError(null)

    fetch(`/content/${activeFile}`)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.text()
      })
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [activeFile])

  useEffect(() => {
    if (!contentRef.current) return
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setEditorWidth(entry.contentRect.width)
      }
    })
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [])

  const isFish = activeFile === 'projects/fish.md'
  const isMarkdown = activeFile && activeFile.endsWith('.md')
  const showToggle = isMarkdown && !loading && !error

  function renderContent() {
    if (!activeFile) {
      return (
        <div className="flex-1 flex items-center justify-center text-lavender-muted text-sm">
          No file open
        </div>
      )
    }

    if (activeFile === 'photos') {
      return <PhotoGallery />
    }

    if (isMarkdown) {
      if (loading) {
        return (
          <div className="flex-1 flex items-center justify-center text-lavender-muted text-sm">
            Loading...
          </div>
        )
      }
      if (error) {
        return (
          <div className="flex-1 flex items-center justify-center text-red-400 text-sm">
            Error: {error}
          </div>
        )
      }

      if (isFish) {
        return (
          <div className="flex-1 overflow-y-auto">
            <GBAEmulator />
            <MarkdownViewer content={content} raw={raw} />
          </div>
        )
      }

      return (
        <div className="flex-1 overflow-y-auto">
          <MarkdownViewer content={content} raw={raw} />
        </div>
      )
    }

    return (
      <div className="flex-1 flex items-center justify-center text-lavender-muted text-sm">
        No preview available
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 bg-lavender-bg overflow-hidden">
      <TabBar />
      <div className="flex items-center justify-between border-b border-lavender-border px-4" style={{ height: '28px', flexShrink: 0 }}>
        <Breadcrumb inline />
        {showToggle && <ViewToggle raw={raw} onToggle={() => setRaw(v => !v)} />}
      </div>
      <div ref={contentRef} className="relative flex flex-col flex-1 overflow-hidden">
        {renderContent()}
        <PetCanvas containerWidth={editorWidth} />
      </div>
    </div>
  )
}
