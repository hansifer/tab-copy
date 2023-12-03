export const formats = [
  {
    id: 'link',
    label: 'Link',
  },
  {
    id: 'url',
    label: 'URL',
  },
  {
    id: 'title-url-1-line',
    label: 'Title: URL',
    opts: {
      separator: ': ',
    },
  },
  {
    id: 'title-url-2-line',
    label: 'Title & URL',
  },
  {
    id: 'title',
    label: 'Title',
  },
  {
    id: 'markdown',
    label: 'Markdown',
  },
  {
    id: 'bbcode',
    label: 'BBCode',
  },
  {
    id: 'csv',
    label: 'CSV',
  },
  {
    id: 'json',
    label: 'JSON',
  },
  {
    id: 'html',
    label: 'HTML',
  },
  {
    id: 'html-table',
    label: 'HTML Table',
    opts: {
      includeHeader: false,
    },
  },
  {
    id: 'custom',
    label: 'Custom',
    opts: {
      name: 'My format',
      template: {
        header: '[date][n][n]',
        tab: '[#]) Title: [title][n]   URL:   [url]',
        delimiter: '[n][n]',
        footer: '',
      },
    },
  },
] as const satisfies readonly {
  id: string
  label: string
  opts?: TitleOpts | HtmlTableOpts | CustomOpts
}[]

export type Format = (typeof formats)[number]

type TitleOpts = {
  separator: string
}

type HtmlTableOpts = {
  includeHeader: boolean
}

type CustomOpts = {
  name: string
  template: {
    header: string
    tab: string
    delimiter: string
    footer: string
  }
}
