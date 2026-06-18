import { useEditor } from '../context/EditorContext'

export default function TitleBar() {
  const { activeFile } = useEditor()

  return (
    <div className="flex items-center justify-between px-4 bg-lavender-titlebar border-b border-lavender-border" style={{ height: '38px', flexShrink: 0 }}>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
      </div>
      <span className="text-sm text-lavender-muted absolute left-1/2 -translate-x-1/2">
        {activeFile ?? 'No file open'}
      </span>
      <div />
    </div>
  )
}
