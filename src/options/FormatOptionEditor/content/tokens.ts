export const tokens = {
  tabCount: {
    id: 'tab-count',
    label: 'tab count',
    token: 'count',
  },
  date: {
    id: 'date',
    label: 'date',
    token: 'date',
  },
  time: {
    id: 'time',
    label: 'time',
    token: 'time',
  },
  dateTime: {
    id: 'date-time',
    label: 'date+time',
    token: 'date+time',
  },
  formatName: {
    id: 'format-name',
    label: 'format name',
    token: 'format name',
  },
  newline: {
    id: 'newline',
    label: 'NEWLINE',
    token: 'n',
  },
  tab: {
    id: 'tab',
    label: 'TAB',
    token: 't',
  },
  tabTitle: {
    id: 'tab-title',
    label: 'title',
    token: 'title',
  },
  tabUrl: {
    id: 'tab-url',
    label: 'url',
    token: 'url',
  },
  tabLink: {
    id: 'tab-link',
    label: 'link',
    token: 'link',
  },
  tabUrlSchema: {
    id: 'tab-url-schema',
    label: 'schema',
    token: 'schema',
  },
  tabUrlHost: {
    id: 'tab-url-host',
    label: 'host',
    token: 'host',
  },
  tabUrlPath: {
    id: 'tab-url-path',
    label: 'path',
    token: 'path',
  },
  tabUrlQuery: {
    id: 'tab-url-query',
    label: 'query',
    token: 'query',
  },
  tabUrlHash: {
    id: 'tab-url-hash',
    label: 'hash',
    token: 'hash',
  },
  tabNumber: {
    id: 'tab-number',
    label: 'tab number',
    token: '#',
  },
} as const satisfies Record<
  string,
  {
    id: string
    label: string
    token: string
  }
>

export type Token = (typeof tokens)[keyof typeof tokens]
