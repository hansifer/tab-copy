export function sentenceCase(text?: string): string {
  if (!text) return ''

  return `${text[0].toLocaleUpperCase()}${text.substring(1)}`
}
