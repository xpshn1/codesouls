/** Opening text of a brief (before any list or code block), as plain text for cards. */
export function briefSummary(text: string): string {
  const lines: string[] = []
  for (const line of text.split('\n')) {
    if (/^(- |\d+\. )/.test(line) || line.startsWith('```') || (line.trim() === '' && lines.length)) break
    if (line.trim()) lines.push(line)
  }
  return lines.join(' ').replace(/`/g, '').replace(/\*\*/g, '').replace(/:$/, '.')
}
