import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView, keymap } from '@codemirror/view'
import { Prec } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { useMemo } from 'react'

const mossTheme = EditorView.theme(
  {
    '&': {
      color: '#f4f8c7',
      backgroundColor: '#111407',
      fontSize: '0.9rem',
      height: '100%',
    },
    '.cm-scroller': { fontFamily: 'var(--mono)', lineHeight: '1.6' },
    '.cm-content': { caretColor: '#d4de95' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#d4de95' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: 'rgba(212, 222, 149, 0.22)' },
    '.cm-gutters': {
      backgroundColor: '#161a0a',
      color: 'rgba(186, 192, 149, 0.5)',
      border: 'none',
      borderRight: '1px solid rgba(212, 222, 149, 0.14)',
    },
    '.cm-activeLine': { backgroundColor: 'rgba(212, 222, 149, 0.05)' },
    '.cm-activeLineGutter': { backgroundColor: 'rgba(212, 222, 149, 0.08)' },
  },
  { dark: true },
)

const mossHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword], color: '#e7b86a' },
    { tag: [t.string, t.special(t.string)], color: '#a8d08d' },
    { tag: [t.number, t.bool, t.null], color: '#f09a6b' },
    { tag: t.comment, color: '#7d8460', fontStyle: 'italic' },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#8fd3c9' },
    { tag: t.definition(t.variableName), color: '#f4f8c7' },
    { tag: [t.propertyName], color: '#cfd99a' },
    { tag: [t.operator, t.punctuation, t.bracket], color: '#bac095' },
    { tag: t.variableName, color: '#f4f8c7' },
  ]),
)

type Props = {
  value: string
  onChange: (value: string) => void
  onRun: () => void
}

export function CodeEditor({ value, onChange, onRun }: Props) {
  const extensions = useMemo(
    () => [
      javascript(),
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              onRun()
              return true
            },
          },
        ]),
      ),
    ],
    [onRun],
  )

  return (
    <CodeMirror
      className="code-editor"
      value={value}
      onChange={onChange}
      extensions={extensions}
      theme={[mossTheme, mossHighlight]}
      height="100%"
      basicSetup={{ foldGutter: false, autocompletion: true }}
      aria-label="Code editor"
    />
  )
}
