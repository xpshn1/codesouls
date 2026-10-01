import { python } from '@codemirror/lang-python'
import { HighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { tags } from '@lezer/highlight'
import { basicSetup } from 'codemirror'
import { useEffect, useRef } from 'react'

// Editor colours follow the design tokens (spec FR-19).
const theme = EditorView.theme(
  {
    '&': { backgroundColor: '#100e0c', color: '#ece5d8', fontSize: '15px', height: '100%' },
    '.cm-scroller': { fontFamily: "'IBM Plex Mono', Consolas, monospace", lineHeight: '1.6' },
    '.cm-content': { caretColor: '#e3a53b', padding: '14px 0' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#e3a53b' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      backgroundColor: 'rgba(227, 165, 59, 0.22)',
    },
    '.cm-gutters': { backgroundColor: '#100e0c', color: '#6f675b', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(236, 229, 216, 0.035)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#a89f90' },
    '&.cm-focused': { outline: 'none' },
    '.cm-matchingBracket': { backgroundColor: 'rgba(227, 165, 59, 0.18)', outline: 'none' },
    '.cm-tooltip': { backgroundColor: '#1e1a15', border: '1px solid #2e2923' },
  },
  { dark: true },
)

const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#e3a53b' },
  { tag: [tags.string, tags.special(tags.string)], color: '#a9c48f' },
  { tag: [tags.number, tags.bool, tags.null], color: '#d99a7a' },
  { tag: tags.comment, color: '#7d7466', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#e8d3a8' },
  { tag: tags.definition(tags.variableName), color: '#f2ead9' },
  { tag: tags.operator, color: '#c9bfae' },
])

type Props = {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  label: string
}

export function CodeEditor({ value, onChange, readOnly = false, label }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const editor = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          indentUnit.of('    '),
          python(),
          theme,
          syntaxHighlighting(highlight),
          EditorState.readOnly.of(readOnly),
          EditorView.editable.of(!readOnly),
          EditorView.contentAttributes.of({ 'aria-label': label }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current?.(update.state.doc.toString())
          }),
        ],
      }),
    })
    view.current = editor
    return () => editor.destroy()
    // The editor is created once; outside value changes are synced below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, label])

  useEffect(() => {
    const editor = view.current
    if (editor && editor.state.doc.toString() !== value) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } })
    }
  }, [value])

  return <div className="code-editor" ref={host} />
}
