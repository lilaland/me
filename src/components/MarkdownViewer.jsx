import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github.css'

const components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-lavender-accent mb-4 mt-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-lavender-accent mb-3 mt-6">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-bold text-lavender-accent mb-2 mt-4">{children}</h3>,
  p: ({ children }) => <p className="text-lavender-text leading-relaxed mb-4">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-lavender-keyword underline decoration-dotted hover:decoration-solid">
      {children}
    </a>
  ),
  code: ({ node, className, children, ...props }) => {
    const isBlock = /language-(\w+)/.exec(className || '') || String(children).includes('\n')
    if (!isBlock) {
      return <code className="bg-lavender-border px-1 rounded text-lavender-accent font-mono text-sm" {...props}>{children}</code>
    }
    return <code className={className} {...props}>{children}</code>
  },
  pre: ({ children }) => (
    <pre className="bg-lavender-sidebar border border-lavender-border rounded p-4 mb-4 overflow-x-auto text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-lavender-accent pl-4 text-lavender-muted italic mb-4">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="text-lavender-text mb-4 pl-6 space-y-1 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="text-lavender-text mb-4 pl-6 space-y-1 list-decimal">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-lavender-active border border-lavender-border px-3 py-1 text-left text-lavender-text">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-lavender-border px-3 py-1 text-lavender-text">{children}</td>
  ),
  img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full rounded my-4" />,
  hr: () => <hr className="border-lavender-border my-6" />,
  strong: ({ children }) => <strong className="text-lavender-text font-bold">{children}</strong>,
  em: ({ children }) => <em className="text-lavender-muted italic">{children}</em>,
}

export default function MarkdownViewer({ content, raw }) {
  const lineCount = content ? content.split('\n').length : 0

  if (raw) {
    return (
      <div className="flex items-stretch">
        <div className="bg-lavender-sidebar text-right text-lavender-muted text-xs select-none pt-6 pb-6 pr-2" style={{ width: '40px', flexShrink: 0, alignSelf: 'stretch' }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} style={{ lineHeight: '1.5rem' }}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 px-8 py-6 text-sm text-lavender-text leading-6 whitespace-pre-wrap break-words overflow-x-auto">
          {content}
        </pre>
      </div>
    )
  }

  return (
    <div className="px-8 py-6 max-w-3xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
