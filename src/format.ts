import {
  // wrap
  getFieldTokens,
  TemplateFieldId,
  TokenValueSources,
} from '@/template-field'
import { ScopeType } from '@/scope'
import { getConfiguredFormat } from '@/configured-format'
import { intl } from '@/intl'
import { sentenceCase, indent, encodeHtml } from '@/util/string'
import { stringifyCSVRow } from '@/util/csv'
import { NxsMimeContent } from '@/util/nxs-mime-type'

// This file contains hardcoded builtin and custom format specs

// To add a new builtin format, add a Format to `builtinFormats` below
// - Specify `opts`, if any, by way of declaring defaults. User-defined format opts, if present, overlay default opts during ConfiguredFormat assembly.

// require a minimum number of visible formats
export const MIN_VISIBLE_FORMAT_COUNT = 3

const DEFAULT_LINK_PLAINTEXT_FALLBACK = 'url'
const DEFAULT_TITLE_URL_1_LINE_SEPARATOR = ': '
const DEFAULT_CUSTOM_FORMAT_NAME = 'Custom format'
const DEFAULT_INDENT_SIZE = 2
export const MAX_INDENT_SIZE = 10 // consistent with JSON.stringify() max

type BuiltinFormat = (typeof builtinFormats)[number]
type BuiltinFormatWithOpts = Extract<BuiltinFormat, { opts: Record<string, any> }>
type CustomFormat = typeof customFormat

type BuiltinFormatId = BuiltinFormat['id']
export type BuiltinFormatWithOptsId = BuiltinFormatWithOpts['id']
export type CustomFormatId = `custom-${string}`

export type FormatId = BuiltinFormatId | CustomFormatId
export type FormatWithOptsId = BuiltinFormatWithOptsId | CustomFormatId
export type FormatWithOpts = BuiltinFormatWithOpts | CustomFormat

export type FormatOpts = {
  [k in Exclude<BuiltinFormatId, BuiltinFormatWithOptsId>]?: undefined
} & {
  [k in BuiltinFormatWithOptsId]: Extract<BuiltinFormatWithOpts, { id: k }>['opts']
} & {
  [k: CustomFormatId]: CustomFormat['opts']
}

// app guarantees tab.url is truthy
const builtinFormats = [
  {
    id: 'link',
    label: () => sentenceCase(intl.link()),
    description: async (opts) =>
      sentenceCase(
        intl.linkDescription(
          await getLinkPlaintextFallbackLabel(opts?.plaintextFallback as string | undefined),
        ),
      ),
    transforms: async (opts) => ({
      text: await getLinkPlaintextFallbackTextTransform(
        opts?.plaintextFallback as string | undefined,
      ),
      html: {
        windowStart: ({ seq }) => `${getNumberedWindowText(seq)}<br>\n<br>\n`,

        tab: ({ tab }) => getAnchorTagHtml(tab),

        tabDelimiter: '<br>\n',

        windowDelimiter: '<br>\n<br>\n',
      },
    }),
    opts: {
      plaintextFallback: DEFAULT_LINK_PLAINTEXT_FALLBACK as string, // Extract<FormatId, 'link'>
    },
  },
  {
    id: 'url',
    label: () => intl.url(),
    transforms: () => ({
      text: urlTextTransform,
    }),
  },
  {
    id: 'titleUrl1Line',
    label: (opts) => sentenceCase(getTitleUrlText(intl.url(), intl.title(), opts?.separator)),
    description: () => sentenceCase(intl.titleUrl1LineDescription()),
    transforms: (opts) => ({
      text: {
        windowStart: ({ seq }) => `${getNumberedWindowText(seq)}\n\n`,

        tab: ({ tab: { title, url } }) => getTitleUrlText(url!, title, opts?.separator),

        tabDelimiter: '\n',

        windowDelimiter: '\n\n',
      },
    }),
    opts: {
      separator: DEFAULT_TITLE_URL_1_LINE_SEPARATOR as string,
    },
  },
  {
    id: 'titleUrl2Line',
    label: () => sentenceCase(intl.conjoin(intl.title(), intl.url())),
    description: () => sentenceCase(intl.titleUrl2LineDescription()),
    transforms: () => ({
      text: {
        windowStart: ({ seq }) => `${getNumberedWindowText(seq)}\n\n`,

        tab: ({ tab: { title, url } }) => getTitleUrlText(url!, title, '\n'),

        tabDelimiter: '\n\n',

        windowDelimiter: '\n\n',
      },
    }),
  },
  {
    id: 'title',
    label: () => sentenceCase(intl.title()),
    transforms: () => ({
      text: {
        windowStart: ({ seq }) => `${getNumberedWindowText(seq)}\n\n`,

        tab: ({ tab: { title, url } }) => title || url!,

        tabDelimiter: '\n',

        windowDelimiter: '\n\n',
      },
    }),
  },
  {
    id: 'markdown',
    label: () => 'Markdown',
    transforms: () => ({
      // todo: make special char escaping more robust across popular markdown renderers (github, etc); https://stackoverflow.com/questions/13824669/how-do-you-write-a-link-containing-a-closing-bracket-in-markdown-syntax
      text: {
        windowStart: ({ seq }) => `## ${getNumberedWindowText(seq)}\n\n`,

        tab: ({ tab: { title, url } }) =>
          `[${
            // wrap
            (title || url!) // wrap
              .replace(/\[/g, '\\[')
              .replace(/\]/g, '\\]')
          }](${
            // wrap
            url! // wrap
              .replace(/\(/g, '\\(')
              .replace(/\)/g, '\\)')
          })`,

        tabDelimiter: '\n\n',

        windowDelimiter: '\n\n',
      },
    }),
    // todo: potential opt: markdown flavor
    // todo: potential opt: window header level (h1, h2, etc)
  },
  {
    id: 'bbcode',
    label: () => 'BBCode',
    description: () => 'Bulletin Board Code',
    transforms: () => ({
      // todo: need to escape embedded bracket chars in url and title or are bbcode interpreters generally smart enough to handle them?
      text: {
        windowStart: ({ seq }) => `${getNumberedWindowText(seq)}\n\n`,

        tab: ({ tab: { title, url } }) =>
          title // wrap
            ? `[url=${url}]${title}[/url]`
            : `[url]${url}[/url]`,

        tabDelimiter: '\n',

        windowDelimiter: '\n\n',
      },
    }),
  },
  {
    id: 'csv',
    label: () => 'CSV',
    description: () => sentenceCase(intl.csvDescription()),
    transforms: () => ({
      text: {
        start: ({ scopeType, tabCount }) =>
          tabCount ? `${scopeType === 'window' ? 'Window,' : ''}Title,URL\n` : '',

        tab: ({ tab: { title, url }, windowSeq }) =>
          stringifyCSVRow(
            [
              windowSeq ? getNumberedWindowText(windowSeq) : undefined, // no windowSeq means scopeType is 'tab'; `undefined` gets absorbed
              title || null,
              url,
            ].filter((item) => item !== undefined),
          ),

        tabDelimiter: '\n',

        windowDelimiter: '\n',
      },
    }),
    // todo: potential opt: properties
    // todo: potential opt: include header
  },
  {
    id: 'json',
    label: () => 'JSON',
    description: () => 'JavaScript Object Notation',
    transforms: (opts) => {
      const newline = opts?.pretty ? '\n' : ''

      const indentSize = opts?.pretty // wrap
        ? parseIndent(opts?.indent) || DEFAULT_INDENT_SIZE
        : 0

      const noProperties = !opts?.properties?.length

      return {
        text: {
          start: () => `[`,

          windowStart: ({ seq }) =>
            `${newline}${indent(
              JSON.stringify(
                {
                  title: getNumberedWindowText(seq),
                  tabs: [], // .replace below opens up this array
                },
                undefined,
                indentSize,
              ).replace(/\[\][\s\n]*\}$/, '['),
              indentSize,
            )}`,

          tab: ({ tab: { title, url, favIconUrl }, windowSeq }) =>
            `${newline}${indent(
              JSON.stringify(
                {
                  ...(title && (noProperties || opts.properties.includes('title'))
                    ? { title }
                    : null),

                  ...(url && (noProperties || opts.properties.includes('url')) // wrap
                    ? { url }
                    : null),

                  ...(favIconUrl && (noProperties || opts.properties.includes('favIconUrl'))
                    ? { favIconUrl }
                    : null),
                },
                undefined,
                indentSize,
              ),
              windowSeq ? indentSize * 3 : indentSize,
            )}`,

          tabDelimiter: ',',

          windowEnd: () =>
            `${newline}${indent(']', indentSize * 2)}${newline}${indent('}', indentSize)}`,

          windowDelimiter: ',',

          end: ({ tabCount }) => `${tabCount ? newline : ''}]`,
        },
        // todo: html representation for syntax-highlighted JSON?
      }
    },
    opts: {
      properties: [
        // wrap
        'title',
        'url',
      ],
      pretty: true,
      indent: `${DEFAULT_INDENT_SIZE}`,
    } as {
      properties: (keyof Pick<chrome.tabs.Tab, 'title' | 'url' | 'favIconUrl'>)[]
      pretty: boolean
      indent: string
    },
    isInvalid: (opts) => !!opts.pretty && !parseIndent(opts.indent),
  },
  {
    id: 'html',
    label: () => 'HTML',
    transforms: () => ({
      text: {
        windowStart: ({ seq }) => `<h2>${getNumberedWindowText(seq)}</h2>\n\n`,

        tab: ({ tab }) => getAnchorTagHtml(tab),

        tabDelimiter: '<br>\n',

        windowDelimiter: '\n\n',
      },
    }),
    // todo: potential opt: window header level (h1, h2, etc)
    // todo: potential opt: anchor tag target attribute
  },
  {
    id: 'htmlTable',
    label: () => sentenceCase(intl.htmlTable()),
    transforms: (opts) => ({
      text: {
        start: ({ scopeType, tabCount }) =>
          tabCount
            ? `<table>\n${
                opts?.includeHeader
                  ? `${indent(getHtmlTableHeaderHtml(scopeType, DEFAULT_INDENT_SIZE), DEFAULT_INDENT_SIZE)}\n`
                  : ''
              }${indent('<tbody>', DEFAULT_INDENT_SIZE)}\n`
            : '',

        tab: ({ tab: { title, url }, windowSeq }) =>
          `${indent(getHtmlTableTabHtml(title, url, windowSeq, DEFAULT_INDENT_SIZE), DEFAULT_INDENT_SIZE * 2)}\n`,

        end: ({ tabCount }) =>
          tabCount ? `${indent('</tbody>', DEFAULT_INDENT_SIZE)}\n</table>` : '',
      },
    }),
    // todo: potential opt: indent size
    opts: {
      includeHeader: false as boolean,
    },
  },
] as const satisfies Format[]

export const customFormat = {
  label: (opts) => opts?.name ?? DEFAULT_CUSTOM_FORMAT_NAME,
  description: () => sentenceCase(intl.customDescription()),
  transforms: (opts) => {
    const now = new Date()
    const template = opts?.template as Record<TemplateFieldId, string> | undefined

    // for html representation, field templates are pre-encoded. additionally, each token value generator encodes portions of its output as needed.
    // - code assumption: tokens, token aliases, and token delimiters do not contain chars encoded by `encodeHtml()`
    const htmlEncodedTemplate = Object.fromEntries(
      Object.entries(template ?? {}).map(
        ([
          // wrap
          fieldId,
          fieldTemplate,
        ]) => [
          // wrap
          fieldId,
          encodeHtml(fieldTemplate),
        ],
      ),
    ) as Record<TemplateFieldId, string>

    return {
      text: {
        start: ({ formatName, windowCount, tabCount }) =>
          interpolate('start', template, {
            now,
            formatName,
            windowCount,
            tabCount,
            representation: 'text',
          }),

        windowStart: ({ seq, windowCount, windowTabCount }) =>
          interpolate('windowStart', template, {
            windowSeq: seq,
            windowCount,
            windowTabCount,
            representation: 'text',
          }),

        tab: ({ tab, globalSeq, windowTabSeq, windowSeq, windowCount }) =>
          interpolate('tab', template, {
            now,
            tab,
            parsedUrl: new URL(tab.url!),
            tabSeq: globalSeq,
            windowTabSeq,
            windowSeq,
            windowCount,
            representation: 'text',
          }),

        tabDelimiter: interpolate('tabDelimiter', template, {
          representation: 'text',
        }),

        windowEnd: ({ seq, windowCount, windowTabCount }) =>
          interpolate('windowEnd', template, {
            windowSeq: seq,
            windowCount,
            windowTabCount,
            representation: 'text',
          }),

        windowDelimiter: interpolate('windowDelimiter', template, {
          representation: 'text',
        }),

        end: ({ formatName, windowCount, tabCount }) =>
          interpolate('end', template, {
            now,
            formatName,
            windowCount,
            tabCount,
            representation: 'text',
          }),
      },
      html: {
        start: ({ formatName, windowCount, tabCount }) =>
          interpolate('start', htmlEncodedTemplate, {
            now,
            formatName,
            windowCount,
            tabCount,
            representation: 'html',
          }),

        windowStart: ({ seq, windowCount, windowTabCount }) =>
          interpolate('windowStart', htmlEncodedTemplate, {
            windowSeq: seq,
            windowCount,
            windowTabCount,
            representation: 'html',
          }),

        tab: ({ tab, globalSeq, windowTabSeq, windowSeq, windowCount }) =>
          interpolate('tab', htmlEncodedTemplate, {
            now,
            tab,
            parsedUrl: new URL(tab.url!),
            tabSeq: globalSeq,
            windowTabSeq,
            windowSeq,
            windowCount,
            representation: 'html',
          }),

        tabDelimiter: interpolate('tabDelimiter', htmlEncodedTemplate, {
          representation: 'html',
        }),

        windowEnd: ({ seq, windowCount, windowTabCount }) =>
          interpolate('windowEnd', htmlEncodedTemplate, {
            windowSeq: seq,
            windowCount,
            windowTabCount,
            representation: 'html',
          }),

        windowDelimiter: interpolate('windowDelimiter', htmlEncodedTemplate, {
          representation: 'html',
        }),

        end: ({ formatName, windowCount, tabCount }) =>
          interpolate('end', htmlEncodedTemplate, {
            now,
            formatName,
            windowCount,
            tabCount,
            representation: 'html',
          }),
      },
    }
  },
  opts: {
    name: DEFAULT_CUSTOM_FORMAT_NAME,
    template: {
      start: '[date+time] - [tcount] tabs[n][n]',
      windowStart: 'Window [w#] ([wtcount] tabs)[n][n]',
      tab: '[wt#]) [title][n][n]URL:  [url][n]Host: [host]',
      tabDelimiter: '[n][n]',
      windowEnd: '',
      windowDelimiter: '[n][n]',
      end: '',
    },
  } as {
    name: string
    template: Record<TemplateFieldId, string>
  },
  isInvalid: (opts) => !opts.name?.trim(),
} as const satisfies Omit<Format, 'id'>

// todo: we want T to be inferred from the opts prop object literal so we can get type checking on opts function args, but TS does not yet support type argument inference in generic types
// https://stackoverflow.com/a/73896583
// https://github.com/microsoft/TypeScript/issues/32794
type Format<T extends Record<string, any> = Record<string, any> /* = infer */> = {
  id: string
  label: (opts?: T) => string
  // icon: JSX.Element
  description?: (opts?: T) => string | Promise<string>
  transforms: (opts?: T) => Transforms | Promise<Transforms>
  opts?: T
  isInvalid?: (opts: T) => boolean
}

// a transform creates a ClipboardItem representation
export type Transforms = {
  text: TextTransform
  html?: TextTransform
  nxs?: NxsTransform
}

type TextTransform = {
  start?: ({
    formatName,
    windowCount,
    tabCount,
    scopeType,
  }: {
    formatName: string
    windowCount?: number // missing for tab-only scopes
    tabCount: number
    scopeType: ScopeType
  }) => string

  windowStart?: ({
    window,
    seq,
    windowCount,
    windowTabCount,
  }: {
    window: chrome.windows.Window
    seq: number
    windowCount: number
    windowTabCount: number
  }) => string

  tab?: ({
    tab,
    globalSeq,
    windowTabSeq,
    windowSeq,
    windowCount,
  }: {
    tab: chrome.tabs.Tab
    globalSeq: number // sequence across all tabs
    windowTabSeq?: number // sequence within window; missing for tab-only scopes
    windowSeq?: number // sequence of the parent window; missing for tab-only scopes
    windowCount?: number // missing for tab-only scopes
  }) => string

  tabDelimiter?: string

  windowEnd?: ({
    window,
    seq,
    windowCount,
    windowTabCount,
  }: {
    window: chrome.windows.Window
    seq: number
    windowCount: number
    windowTabCount: number
  }) => string

  windowDelimiter?: string

  end?: ({
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

// --- type guards

export function isFormatId(id: string): id is FormatId {
  return id.startsWith('custom-') || (builtinFormatIds as ReadonlyArray<string>).includes(id)
}

export function isFormatWithOptsId(id: FormatId): id is FormatWithOptsId {
  return isBuiltinFormatWithOptsId(id) || isCustomFormatId(id)
}

const builtinFormatWithOptsIds = builtinFormats
  .filter((format) => 'opts' in format)
  .map(({ id }) => id)

export function isBuiltinFormatWithOptsId(id: FormatId): id is BuiltinFormatWithOptsId {
  return (builtinFormatWithOptsIds as ReadonlyArray<FormatId>).includes(id)
}

export function isCustomFormatId(id: FormatId): id is CustomFormatId {
  return id.startsWith('custom-')
}

// --- helpers

const urlTextTransform: TextTransform = {
  windowStart: ({ seq }) => `${getNumberedWindowText(seq)}\n\n`,

  tab: ({ tab }) => tab.url!, // app guarantees tab.url is truthy

  tabDelimiter: '\n',

  windowDelimiter: '\n\n',
}

function getTitleUrlText(
  url: string,
  title?: string,
  separator = DEFAULT_TITLE_URL_1_LINE_SEPARATOR,
) {
  return `${title || '(untitled)'}${separator}${url}`
}

export function getAnchorTagHtml(tab: chrome.tabs.Tab) {
  return tab.url // wrap
    ? `<a href="${tab.url}">${encodeHtml(tab.title || tab.url)}</a>`
    : ''
}

function getNumberedWindowText(seq: number) {
  return `${sentenceCase(intl.window())} ${seq}`
}

function getHtmlTableHeaderHtml(scopeType: ScopeType, contentIndent: number) {
  return wrap(
    wrap(
      list(
        // wrap
        scopeType === 'window' ? '<th>Window</th>' : null,
        '<th>Title</th>',
        '<th>URL</th>',
      ),
      'tr',
      contentIndent,
    ),
    'thead',
    contentIndent,
  )
}

function getHtmlTableTabHtml(
  title: string | undefined,
  url: string | undefined,
  windowSeq: number | undefined,
  contentIndent: number,
) {
  return wrap(
    list(
      windowSeq ? `<td>${getNumberedWindowText(windowSeq)}</td>` : null,
      `<td>${title || ''}</td>`,
      `<td>${url || ''}</td>`,
    ),
    'tr',
    contentIndent,
  )
}

function wrap(text: string, tag: string, contentIndent: number) {
  return `<${tag}>\n${indent(text, contentIndent)}\n</${tag}>`
}

function list(...args: (string | null)[]) {
  return args.filter(Boolean).join('\n')
}

// return indent number or undefined if 0, NaN, or out of range
export function parseIndent(indent: string) {
  const indentNum = parseInt(indent, 10)

  if (indentNum && indentNum <= MAX_INDENT_SIZE && indentNum >= 1) {
    return indentNum
  }
}

function interpolate(
  fieldId: TemplateFieldId,
  template: Record<TemplateFieldId, string> | undefined,
  sources: TokenValueSources = {},
) {
  if (!template) return ''

  return getFieldTokens(fieldId).reduce(
    (acc, token) => acc.replace(token.regex, token.value(sources)),
    template[fieldId], // start with field template
  )
}

// return type annotation necessary to address TS circular reference error
async function getLinkPlaintextFallbackTextTransform(formatId?: string): Promise<TextTransform> {
  const format = await getLinkPlaintextFallbackFormat(formatId)
  return format.transforms.text
}

// return type annotation necessary to address TS circular reference error
async function getLinkPlaintextFallbackLabel(formatId?: string): Promise<string> {
  const format = await getLinkPlaintextFallbackFormat(formatId)
  return format.label
}

function getLinkPlaintextFallbackFormat(formatId?: string) {
  return getConfiguredFormat(
    formatId && isFormatId(formatId) && formatId !== 'link'
      ? formatId
      : DEFAULT_LINK_PLAINTEXT_FALLBACK,
  )
}
