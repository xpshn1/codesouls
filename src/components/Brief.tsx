import type { ReactNode } from 'react'

/** Renders `code` and **bold** inside a line of text. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

/**
 * A deliberately tiny markdown renderer for challenge briefs: paragraphs,
 * "- " bullet lists, fenced code blocks, inline code, and bold.
 */
export function Brief({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  const lines = text.split('\n')
  let paragraph: string[] = []
  let list: string[] = []
  let ordered = false

  const flush = () => {
    if (paragraph.length) {
      blocks.push(<p key={blocks.length}>{inline(paragraph.join(' '))}</p>)
      paragraph = []
    }
    if (list.length) {
      const items = list.map((item, index) => <li key={index}>{inline(item)}</li>)
      blocks.push(ordered ? <ol key={blocks.length}>{items}</ol> : <ul key={blocks.length}>{items}</ul>)
      list = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('```')) {
      flush()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i])
        i++
      }
      blocks.push(
        <pre key={blocks.length} className="brief-code">
          <code>{code.join('\n')}</code>
        </pre>,
      )
    } else if (/^(- |\d+\. )/.test(line)) {
      const isOrdered = !line.startsWith('- ')
      if (paragraph.length || (list.length && isOrdered !== ordered)) flush()
      ordered = isOrdered
      list.push(line.replace(/^(- |\d+\. )/, ''))
    } else if (line.trim() === '') {
      flush()
    } else {
      if (list.length) flush()
      paragraph.push(line)
    }
  }
  flush()

  return <div className="brief">{blocks}</div>
}
