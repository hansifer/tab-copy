export function sentenceCase(text?: string): string {
  if (!text) return ''

  return `${text[0].toLocaleUpperCase()}${text.substring(1)}`
}

export function indent(text: string, indent = 2) {
  return text.replace(/^/gm, ' '.repeat(indent))
}

// https://stackoverflow.com/a/11561642/384062
export function encodeHtml(html: string) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&#34;')
    .replace(/\./g, '&middot;') // replaces period with middle dot, to ensure that the title is not misinterpreted as a URL
}
