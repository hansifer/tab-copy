import { intl } from '@/intl'
import { sentenceCase, indent, encodeHtml } from '@/util/string'
import { NxsMimeContent } from '@/util/nxs-mime-type'

// This file contains hardcoded builtin and custom format specs

// To add a new builtin format, add a Format to `builtinFormats` below
// - Specify `opts`, if any, by way of declaring defaults. User-defined format opts, if present, overlay default opts during ConfiguredFormat assembly.

// require a minimum number of visible formats
export const MIN_VISIBLE_FORMAT_COUNT = 3

const DEFAULT_TITLE_URL_1_LINE_SEPARATOR = ': '
const DEFAULT_CUSTOM_FORMAT_NAME = 'Custom format'

type BuiltinFormat = (typeof builtinFormats)[number]
type BuiltinFormatWithOpts = Extract<BuiltinFormat, { opts: Record<string, any> }>
type CustomFormat = typeof customFormat

type BuiltinFormatId = BuiltinFormat['id']
export type BuiltinFormatWithOptsId = BuiltinFormatWithOpts['id']
export type CustomFormatId = `custom-${string}`

export type FormatId = BuiltinFormatId | CustomFormatId
export type FormatWithOptsId = BuiltinFormatWithOptsId | CustomFormatId

export type FormatOpts = {
  [k in Exclude<BuiltinFormatId, BuiltinFormatWithOptsId>]?: undefined
} & {
  [k in BuiltinFormatWithOptsId]: Extract<BuiltinFormatWithOpts, { id: k }>['opts']
} & {
  [k: CustomFormatId]: CustomFormat['opts']
}

const builtinFormats = [
  {
    id: 'link',
    label: () => intl.link(),
    transforms: () => ({
      text: {
        tab: ({ tab }) => tab.url ?? '',
      },
      html: {
        tab: ({ tab }) => getAnchorTagHtml(tab),
        tabDelimiter: '<br>\n',
      },
    }),
  },
  {
    id: 'url',
    label: () => intl.url(),
    transforms: () => ({
      text: {
        window: ({ seq }) => `${sentenceCase(intl.window())} ${seq}\n\n`,
        tab: ({ tab }) => tab.url ?? '',
      },
    }),
  },
  {
    id: 'titleUrl1Line',
    label: (opts) => getTitleUrl1LineText(intl.title(), intl.url(), opts?.separator),
    transforms: (opts) => ({
      text: {
        window: ({ seq }) => `${intl.window()} ${seq}`,
        tab: ({ tab: { title, url } }) => getTitleUrl1LineText(title, url, opts?.separator),
        tabDelimiter: '',
      },
    }),
    opts: {
      separator: DEFAULT_TITLE_URL_1_LINE_SEPARATOR,
    } as {
      separator: string
    },
  },
  {
    id: 'titleUrl2Line',
    label: () => intl.conjoin(intl.title(), intl.url()),
    transforms: () => ({
      text: {
        window: ({ seq }) => `${intl.window()} ${seq}`,
        tab: ({ tab: { title, url } }) => title || url || '',
        tabDelimiter: '',
      },
    }),
  },
  {
    id: 'title',
    label: () => intl.title(),
    transforms: () => ({
      text: {
        window: ({ seq }) => `${intl.window()} ${seq}`,
        tab: ({ tab: { title, url } }) => title || url || '',
        tabDelimiter: '',
      },
    }),
  },
  {
    id: 'markdown',
    label: () => 'Markdown',
    transforms: () => ({
      text: {
        window: ({ seq }) => `${intl.window()} ${seq}`,
        tab: ({ tab: { title, url } }) => title || url || '',
        tabDelimiter: '',
      },
    }),
  },
  {
    id: 'bbcode',
    label: () => 'BBCode',
    transforms: () => ({
      text: {
        window: ({ seq }) => `${intl.window()} ${seq}`,
        tab: ({ tab: { title, url } }) => title || url || '',
        tabDelimiter: '',
      },
    }),
  },
  {
    id: 'csv',
    label: () => 'CSV',
    transforms: (opts) => ({
      text: {
        window: ({ seq }) => `${intl.window()} ${seq} ${opts}`,
        tab: ({ tab: { title, url } }) => title || url || '',
        tabDelimiter: '',
      },
    }),
  },
  {
    id: 'json',
    label: () => 'JSON',
    transforms: () => ({
      text: {
        header: () => '[\n',
        tab: ({ tab: { title, url } }) =>
          indent(
            JSON.stringify(
              {
                ...(title ? { title: title } : null),
                url: url,
                // ...(favIconUrl ? { favIconUrl: favIconUrl } : null), // omit for now. need decision on how to handle view transforms during copy
              },
              undefined,
              3,
            ),
            3,
          ),
        tabDelimiter: ',\n',
        footer: () => '\n]',
      },
    }),
    opts: {
      pretty: true,
      indent: '3',
      properties: [
        // wrap
        'title',
        'url',
      ],
    } as {
      pretty: boolean
      indent: string
      properties: (keyof chrome.tabs.Tab)[]
    },
  },
  {
    id: 'html',
    label: () => 'HTML',
    transforms: (opts) => ({
      text: {
        window: ({ seq }) => `${intl.window()} ${seq}`,
        tab: ({ tab: { title, url } }) => title || url || '',
        tabDelimiter: '',
      },
    }),
  },
  {
    id: 'htmlTable',
    label: () => intl.htmlTable(),
    transforms: () => ({
      text: {
        tab: ({ tab }) => getAnchorTagHtml(tab),
        tabDelimiter: '<br>\n',
      },
      html: {
        tab: ({ tab }) => getAnchorTagHtml(tab),
        tabDelimiter: '<br>\n',
      },
    }),
    opts: {
      includeHeader: false,
    } as {
      includeHeader: boolean
    },
  },
] as const satisfies Format[]

const customFormat = {
  label: (opts) => opts?.name ?? DEFAULT_CUSTOM_FORMAT_NAME,
  transforms: () => ({
    text: {
      tab: ({ tab }) => `${tab.title}\n${tab.url}`,
    },
  }),
  opts: {
    name: DEFAULT_CUSTOM_FORMAT_NAME,
    template: {
      header: '[date][n][n]',
      tab: '[#]) Title: [title][n]   URL:   [url]',
      delimiter: '[n][n]',
      footer: '',
    },
  } as {
    name: string
    template: {
      header: string
      tab: string
      delimiter: string
      footer: string
    }
  },
} as const satisfies Omit<Format, 'id'>

// todo: we want T to be inferred from the opts prop object literal so we can get type checking on opts function args, but TS does not yet support type argument inference in generic types
// https://stackoverflow.com/a/73896583
// https://github.com/microsoft/TypeScript/issues/32794
type Format<T extends Record<string, any> = Record<string, any> /* = infer */> = {
  id: string
  label: (opts?: T) => string
  // icon: JSX.Element
  transforms: (opts?: T) => Transforms
  opts?: T
}

// a transform creates a ClipboardItem representation
export type Transforms = {
  text: TextTransform
  html?: TextTransform
  nxs?: NxsTransform
}

export type TextTransform = {
  header?: ({
    formatName,
    windowCount,
    tabCount,
  }: {
    formatName: string
    windowCount?: number // missing for tab-only scopes
    tabCount: number
  }) => string

  window?: ({
    window,
    seq,
    windowTabCount,
  }: {
    window: chrome.windows.Window
    seq: number
    windowTabCount: number
  }) => string

  windowDelimiter?: string // default: `\n\n` // todo: confirm this is the case

  tab?: ({
    tab,
    globalSeq,
    windowTabSeq,
  }: {
    tab: chrome.tabs.Tab
    globalSeq: number
    windowTabSeq?: number // missing for tab-only scopes
  }) => string

  tabDelimiter?: string // default: `\n` // todo: confirm this is the case

  footer?: ({
    formatName,
    windowCount,
    tabCount,
  }: {
    formatName: string
    windowCount?: number // missing for tab-only scopes
    tabCount: number
  }) => string
}

type NxsTransform = (wins: chrome.windows.Window[]) => NxsMimeContent

export const builtinFormatIds = builtinFormats.map(({ id }) => id)

export function getFormat<T extends FormatId>(id: T) {
  return (
    isCustomFormatId(id) // wrap
      ? customFormat
      : builtinFormats.find((format) => format.id === id)
  ) as T extends CustomFormatId ? CustomFormat : Extract<BuiltinFormat, { id: T }>
}

// --- user-defined type guards

const builtinFormatWithOptsIds = builtinFormats
  .filter((format) => 'opts' in format)
  .map(({ id }) => id)

export function isBuiltinFormatWithOptsId(id: FormatId): id is BuiltinFormatWithOptsId {
  return (builtinFormatWithOptsIds as ReadonlyArray<FormatId>).includes(id)
}

export function isCustomFormatId(id: FormatId): id is CustomFormatId {
  return id.startsWith('custom-')
}

function getTitleUrl1LineText(
  title = '(untitled)',
  url = '(unknown)',
  separator = DEFAULT_TITLE_URL_1_LINE_SEPARATOR,
) {
  return `${title}${separator}${url}`
}

function getAnchorTagHtml(tab: chrome.tabs.Tab) {
  return tab.url // wrap
    ? `<a href="${tab.url}">${encodeHtml(tab.title || tab.url)}</a>`
    : ''
}
