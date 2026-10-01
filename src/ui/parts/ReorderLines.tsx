// Reorder-the-lines drill input (spec FR-3): move lines with buttons; keyboard friendly.
import { DownIcon, UpIcon } from './Icons.tsx'

type Props = {
  lines: string[]
  order: number[]
  onChange: (order: number[]) => void
  disabled?: boolean
}

export function ReorderLines({ lines, order, onChange, disabled = false }: Props) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return
    const next = [...order]
    ;[next[from], next[to]] = [next[to], next[from]]
    onChange(next)
  }
  return (
    <ol className="reorder" aria-label="Lines of code, in order">
      {order.map((lineIndex, position) => (
        <li key={lineIndex} className="reorder-row">
          <span className="reorder-num">{position + 1}</span>
          <code className="reorder-line">{lines[lineIndex]}</code>
          <button
            type="button"
            className="btn btn-ghost icon-btn"
            aria-label={`Move line ${position + 1} up`}
            disabled={disabled || position === 0}
            onClick={() => move(position, position - 1)}
          >
            <UpIcon />
          </button>
          <button
            type="button"
            className="btn btn-ghost icon-btn"
            aria-label={`Move line ${position + 1} down`}
            disabled={disabled || position === order.length - 1}
            onClick={() => move(position, position + 1)}
          >
            <DownIcon />
          </button>
        </li>
      ))}
    </ol>
  )
}
