import { getAnchorTagHtml } from '@/format'
import { regExEscape } from '@/util/regex'
import { encodeHtml } from '@/util/string'
import { intl } from '@/intl'

// This file contains specs for the tokens and template fields used by custom formats

// todo: intl token labels

export type Token = {
  id: string
  label: () => string // label of token in token selector
  token: string // text of inline token
  aliases?: string[] // aliases for text of inline token, mostly historic
  value: (source: TokenValueSources) => string
}

// sources that token values may draw from
export type TokenValueSources = {
  now?: Date
  tabSeq?: number
  windowTabSeq?: number
  windowSeq?: number
  tabCount?: number
  windowTabCount?: number
  windowCount?: number
  tab?: chrome.tabs.Tab
  parsedUrl?: URL
  formatName?: string
  representation?: 'text' | 'html'
}

export type TemplateFieldId = (typeof templateFields)[number]['id']

const tokens = [
  {
    id: 'tab-number',
    label: () => 'tab #',
    token: 't#',
    aliases: [
      '#',
      'number',
      'tab#',
      'tabnumber',
      'tab #',
      'tab number',
      'tab-#',
      'tab-number',
      'tab+#',
      'tab+number',
    ],
    value: ({ tabSeq }) => stringify(tabSeq),
  },
  {
    id: 'window-tab-number',
    label: () => 'window tab #',
    token: 'wt#',
    value: ({ windowTabSeq, tabSeq }) => stringify(windowTabSeq ?? tabSeq), // allow undefined windowTabSeq to fallback to tabSeq for custom formats for scope flexibility (one token wt# that works for both scope types)
  },
  {
    id: 'window-number',
    label: () => 'window #',
    token: 'w#',
    value: ({ windowSeq }) => stringify(windowSeq),
  },
  {
    id: 'tab-count',
    label: () => 'tab count',
    token: 'tcount',
    aliases: ['count'],
    value: ({ tabCount }) => stringify(tabCount),
  },
  {
    id: 'window-tab-count',
    label: () => 'window tab count',
    token: 'wtcount',
    value: ({ windowTabCount }) => stringify(windowTabCount),
  },
  {
    id: 'window-count',
    label: () => 'window count',
    token: 'wcount',
    value: ({ windowCount }) => stringify(windowCount),
  },
  {
    id: 'tab-title',
    label: () => 'title',
    token: 'title',
    value: ({ tab, representation }) => encode(tab?.title, representation),
  },
  {
    id: 'tab-url',
    label: () => 'url',
    token: 'url',
    value: ({ tab, representation }) => encode(tab?.url, representation),
  },
  {
    id: 'tab-link',
    label: () => 'link',
    token: 'link',
    value: ({ tab, representation }) =>
      tab // wrap
        ? representation === 'html'
          ? getAnchorTagHtml(tab)
          : (tab.url ?? '')
        : '',
  },
  {
    id: 'tab-icon',
    label: () => 'icon',
    token: 'icon',
    value: ({ tab, representation }) => encode(tab?.favIconUrl, representation),
  },
  {
    id: 'tab-url-schema',
    label: () => 'schema',
    token: 'schema',
    aliases: ['protocol'],
    value: ({ parsedUrl }) => parsedUrl?.protocol.replace(/:$/, '') ?? '',
  },
  {
    id: 'tab-url-host',
    label: () => 'host',
    token: 'host',
    value: ({ parsedUrl, representation }) => encode(parsedUrl?.host, representation),
  },
  {
    id: 'tab-url-path',
    label: () => 'path',
    token: 'path',
    value: ({ parsedUrl, representation }) =>
      encode(parsedUrl?.pathname.replace(/^\//, ''), representation),
  },
  {
    id: 'tab-url-query',
    label: () => 'query',
    token: 'query',
    value: ({ parsedUrl, representation }) =>
      encode(parsedUrl?.search.replace(/^\?/, ''), representation),
  },
  {
    id: 'tab-url-hash',
    label: () => 'hash',
    token: 'hash',
    value: ({ parsedUrl, representation }) =>
      encode(parsedUrl?.hash.replace(/^\#/, ''), representation),
  },
  {
    id: 'date',
    label: () => 'date',
    token: 'date',
    value: ({ now, representation }) => encode(now?.toLocaleDateString(), representation),
  },
  {
    id: 'time',
    label: () => 'time',
    token: 'time',
    value: ({ now, representation }) => encode(now?.toLocaleTimeString(), representation),
  },
  {
    id: 'date-time',
    label: () => 'date+time',
    token: 'date+time',
    aliases: ['datetime', 'date time', 'date-time'],
    value: ({ now, representation }) => encode(now?.toLocaleString(), representation),
  },
  {
    id: 'newline',
    label: () => 'NEWLINE',
    token: 'n',
    aliases: ['newline'],
    value: ({ representation }) => (representation === 'html' ? '<br>\n' : '\n'),
  },
  {
    id: 'tabulator',
    label: () => 'TAB',
    token: 't',
    aliases: ['tab'],
    value: ({ representation }) => (representation === 'html' ? '&#9;' : '\t'),
  },
  {
    id: 'format-name',
    label: () => 'format name',
    token: 'fname',
    aliases: ['formatname', 'format name', 'format-name', 'format+name'],
    value: ({ formatName, representation }) => encode(formatName, representation),
  },
] as const satisfies Token[]

export const templateFields = [
  {
    id: 'start',
    label: () => intl.start(),
    tokens: selectTokens(
      'tab-count',
      'window-count',
      'date',
      'time',
      'date-time',
      'newline',
      'tabulator',
      'format-name',
    ),
  },
  {
    id: 'windowStart',
    label: () => intl.windowStart(),
    tokens: selectTokens(
      'window-number',
      'window-count',
      'window-tab-count',
      'newline',
      'tabulator',
    ),
  },
  {
    id: 'tab',
    label: () => intl.tab(),
    tokens: selectTokens(
      'tab-title',
      'tab-url',
      'tab-icon',
      'tab-link',
      'tab-url-schema',
      'tab-url-host',
      'tab-url-path',
      'tab-url-query',
      'tab-url-hash',
      'tab-number',
      'window-tab-number',
      'window-number',
      'window-count',
      'date',
      'time',
      'date-time',
      'newline',
      'tabulator',
    ),
  },
  {
    id: 'tabDelimiter',
    label: () => intl.tabDelimiter(),
    tokens: selectTokens('newline', 'tabulator'),
  },
  {
    id: 'windowEnd',
    label: () => intl.windowEnd(),
    tokens: selectTokens(
      'window-number',
      'window-count',
      'window-tab-count',
      'newline',
      'tabulator',
    ),
  },
  {
    id: 'windowDelimiter',
    label: () => intl.windowDelimiter(),
    tokens: selectTokens('newline', 'tabulator'),
  },
  {
    id: 'end',
    label: () => intl.end(),
    tokens: selectTokens(
      'tab-count',
      'window-count',
      'date',
      'time',
      'date-time',
      'newline',
      'tabulator',
      'format-name',
    ),
  },
] as const satisfies {
  id: string
  label: () => string
  tokens: (typeof tokens)[number][]
}[]

function selectTokens<T extends (typeof tokens)[number]['id'][]>(...ids: T) {
  return ids
    .map(
      (id) =>
        tokens.find((token) => token.id === id) as Extract<
          (typeof tokens)[number],
          { id: T[number] }
        >,
    )
    .filter(Boolean)
}

// creates a regular expression that matches one or more tokens, including aliases
// first capture group captures padded token content. second capture group captures trimmed token content.
export function makeTokenRegExp(tokens: Token[]) {
  return new RegExp(
    `\\[(\\s*(${tokens.flatMap(({ token, aliases = [] }) => [token, ...aliases].map((token) => regExEscape(token))).join('|')})\\s*)]`,
    'g',
  )
}

export function getFieldTokens(fieldId: TemplateFieldId) {
  return templateFields.find(({ id }) => id === fieldId)?.tokens ?? []
}

// stringifies a value with a special case for undefined
function stringify(val: unknown) {
  return val === undefined ? '' : `${val}`
}

function encode(value: string | null | undefined, representation: 'text' | 'html' = 'text') {
  return representation === 'html' // wrap
    ? encodeHtml(value ?? '')
    : (value ?? '')
}
