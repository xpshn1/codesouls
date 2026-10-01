// Renders content prose: paragraphs, "- " bullet lines and `code` spans. Content is our own static data.
import type { ReactNode } from 'react'

function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part,
  )
}

export function Prose({ text }: { text: string }) {
  const blocks = text.split('\n\n')
  return (
    <div className="prose">
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        const bullets = lines.filter((l) => l.startsWith('- '))
        const lead = lines.filter((l) => !l.startsWith('- '))
        return (
          <div key={i}>
            {lead.length > 0 && <p>{inline(lead.join(' '))}</p>}
            {bullets.length > 0 && (
              <ul>
                {bullets.map((b, j) => (
                  <li key={j}>{inline(b.slice(2))}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
