import { regExEscape } from '@/util/regex'
import { intl } from '@/intl'

// This file contains specs for the template fields used by custom formats

// todo: intl token labels

export type Token = {
  id: string
  label: () => string
  token: string
  aliases?: string[]
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
  },
  {
    id: 'window-tab-number',
    label: () => 'window tab #',
    token: 'wt#',
  },
  {
    id: 'window-number',
    label: () => 'window #',
    token: 'w#',
  },
  {
    id: 'tab-count',
    label: () => 'tab count',
    token: 'tcount',
    aliases: ['count'],
  },
  {
    id: 'window-tab-count',
    label: () => 'window tab count',
    token: 'wtcount',
  },
  {
    id: 'window-count',
    label: () => 'window count',
    token: 'wcount',
  },
  {
    id: 'tab-title',
    label: () => 'title',
    token: 'title',
  },
  {
    id: 'tab-url',
    label: () => 'url',
    token: 'url',
  },
  {
    id: 'tab-link',
    label: () => 'link',
    token: 'link',
  },
  {
    id: 'tab-url-schema',
    label: () => 'schema',
    token: 'schema',
  },
  {
    id: 'tab-url-host',
    label: () => 'host',
    token: 'host',
  },
  {
    id: 'tab-url-path',
    label: () => 'path',
    token: 'path',
  },
  {
    id: 'tab-url-query',
    label: () => 'query',
    token: 'query',
  },
  {
    id: 'tab-url-hash',
    label: () => 'hash',
    token: 'hash',
  },
  {
    id: 'date',
    label: () => 'date',
    token: 'date',
  },
  {
    id: 'time',
    label: () => 'time',
    token: 'time',
  },
  {
    id: 'date-time',
    label: () => 'date+time',
    token: 'date+time',
    aliases: ['datetime', 'date time', 'date-time'],
  },
  {
    id: 'newline',
    label: () => 'NEWLINE',
    token: 'n',
    aliases: ['newline'],
  },
  {
    id: 'tabulator',
    label: () => 'TAB',
    token: 't',
    aliases: ['tab'],
  },
  {
    id: 'format-name',
    label: () => 'format name',
    token: 'fname',
    aliases: ['formatname', 'format name', 'format-name', 'format+name'],
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

function selectTokens(...args: (typeof tokens)[number]['id'][]) {
  return args
    .map((id) => tokens.find((token) => token.id === id))
    .filter((token): token is (typeof tokens)[number] => !!token)
}

// creates a regular expression that matches one or more tokens, including aliases
export function makeTokenRegExp(tokens: Token[]) {
  return new RegExp(
    `\\[\\s*(${tokens.flatMap(({ token, aliases = [] }) => [token, ...aliases].map((token) => regExEscape(token))).join('|')})\\s*]`,
    'g',
  )
}
