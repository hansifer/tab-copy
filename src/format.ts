import { getFormatOption } from '@/storage'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

export type BuiltInFormatId = (typeof builtInFormatIds)[number]
export type CustomFormatId = `custom-${string}`
export type FormatId = BuiltInFormatId | CustomFormatId

export type BuiltInFormatOptions = typeof builtinFormatOptions
export type CustomFormatOption = typeof customFormatOption

export type BuiltInFormatWithOptionId = keyof BuiltInFormatOptions
export type BuiltInFormatWithoutOptionId = Exclude<BuiltInFormatId, BuiltInFormatWithOptionId>

export type FormatOptions = {
  [k in BuiltInFormatWithOptionId]: BuiltInFormatOptions[k]
} & {
  [k in BuiltInFormatWithoutOptionId]?: undefined
} & {
  [k: CustomFormatId]: CustomFormatOption
}

// require a minimum number of selectable formats
export const MIN_SELECTABLE_FORMAT_COUNT = 3

// --- 1. add new built-in format id below ---

export const builtInFormatIds = [
  'link',
  'url',
  'titleUrl1Line',
  'titleUrl2Line',
  'title',
  'markdown',
  'bbcode',
  'csv',
  'json',
  'html',
  'htmlTable',
] as const

export function getFormatLabel(id: FormatId) {
  return isBuiltInFormatId(id) // wrap
    ? getBuiltInFormatLabel(id)
    : getCustomFormatLabel(id)
}

// --- 2. add new built-in format id-to-label mapping below ---

async function getBuiltInFormatLabel(id: BuiltInFormatId): Promise<string> {
  switch (id) {
    case 'link':
      return sentenceCase(intl.link())
    case 'url':
      return intl.url()
    case 'titleUrl1Line':
      const { separator } = await getFormatOption('titleUrl1Line')
      return `${sentenceCase(intl.title())}${separator}${sentenceCase(intl.url())}`
    case 'titleUrl2Line':
      return intl.conjoin(sentenceCase(intl.title()), sentenceCase(intl.url()))
    case 'title':
      return sentenceCase(intl.title())
    case 'markdown':
      return 'Markdown'
    case 'bbcode':
      return 'BBCode'
    case 'csv':
      return 'CSV'
    case 'json':
      return 'JSON'
    case 'html':
      return 'HTML'
    case 'htmlTable':
      return sentenceCase(intl.htmlTable())
  }
}

async function getCustomFormatLabel(id: CustomFormatId): Promise<string> {
  const { name } = await getFormatOption(id)
  return name
}

// --- 3. add new built-in format option, if any, below by way of declaring defaults ---

export const builtinFormatOptions = {
  titleUrl1Line: {
    separator: ': ',
  },
  htmlTable: {
    includeHeader: false,
  },
} satisfies { [k in BuiltInFormatId]?: Record<string, any> }

export const customFormatOption = {
  name: 'Custom format',
  template: {
    header: '[date][n][n]',
    tab: '[#]) Title: [title][n]   URL:   [url]',
    delimiter: '[n][n]',
    footer: '',
  },
}

// select format option from lookup with default fallback
export function selectFormatOption<T extends FormatId>(
  id: T,
  lookup?: Partial<FormatOptions>,
): FormatOptions[T] {
  if (lookup?.[id]) return lookup[id]! // TS can't figure out that `lookup[id]` is defined

  // fallback

  if (isBuiltInFormatWithOptionId(id)) {
    return builtinFormatOptions[id]
  }

  if (isCustomFormatId(id)) {
    return customFormatOption as FormatOptions[T] // todo: why is assertion necessary?
  }

  return undefined as FormatOptions[T] // todo: why is assertion necessary?
}

// user-defined type guards

export function isBuiltInFormatId(id: FormatId): id is BuiltInFormatId {
  // https://stackoverflow.com/a/56745484/384062
  return (builtInFormatIds as ReadonlyArray<string>).includes(id)
}

export function isBuiltInFormatWithOptionId(id: FormatId): id is BuiltInFormatWithOptionId {
  return id in builtinFormatOptions
}

export function isCustomFormatId(id: FormatId): id is CustomFormatId {
  return id.startsWith('custom-')
}
