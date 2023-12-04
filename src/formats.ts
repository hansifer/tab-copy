import {
  getOrderedFormatIds,
  getSelectableFormatIds,
  getPrimaryFormatId,
  getFormatOpts,
} from '@/storage'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'

// require a minimum number of selectable formats
export const MIN_SELECTABLE_FORMAT_COUNT = 3

// --- 1. add new static format id below ---

export const formatIds = [
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
  'custom',
] as const

export type FormatId = (typeof formatIds)[number]

// --- 2. add new static format id-to-label mapping below ---

export async function getFormatLabel(id: FormatId): Promise<string> {
  switch (id) {
    case 'link':
      return sentenceCase(intl.link())
    case 'url':
      return intl.url()
    case 'titleUrl1Line':
      const { separator } = (await getFormatOpts('titleUrl1Line'))!
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
    case 'custom':
      return 'Custom' // not used
  }
}

// --- 3. add new format opts, if any, below by way of declaring defaults ---

export const formatOpts = {
  titleUrl1Line: {
    separator: ': ',
  },
  htmlTable: {
    includeHeader: false,
  },
  custom: {
    name: 'My format',
    template: {
      header: '[date][n][n]',
      tab: '[#]) Title: [title][n]   URL:   [url]',
      delimiter: '[n][n]',
      footer: '',
    },
  },
} satisfies { [k in FormatId]?: Record<string, any> }

export function formatHasOpts(id: FormatId): id is keyof typeof formatOpts {
  return id in formatOpts
}

export type ConfiguredFormat = {
  id: FormatId
  label: string
  selectable?: boolean
  primary?: boolean
  opts?: (typeof formatOpts)[keyof typeof formatOpts] | null
}

export async function getConfiguredFormat(id: FormatId): Promise<ConfiguredFormat> {
  const selectableFormatIds = await getSelectableFormatIds()
  const primaryFormatId = await getPrimaryFormatId()

  return createConfiguredFormat(id, selectableFormatIds, primaryFormatId)
}

export async function getConfiguredFormats({
  selectableOnly,
}: { selectableOnly?: boolean } = {}): Promise<ConfiguredFormat[]> {
  const selectableFormatIds = await getSelectableFormatIds()
  const primaryFormatId = await getPrimaryFormatId()

  const formatIds = selectableOnly // wrap
    ? selectableFormatIds
    : await getOrderedFormatIds()

  return Promise.all(
    formatIds.map((id) => createConfiguredFormat(id, selectableFormatIds, primaryFormatId)),
  )
}

async function createConfiguredFormat(
  id: FormatId,
  selectableFormatIds: FormatId[],
  primaryFormatId: FormatId,
): Promise<ConfiguredFormat> {
  return {
    id,
    label: await getFormatLabel(id),
    selectable: selectableFormatIds.includes(id),
    primary: primaryFormatId === id,
    opts: await getFormatOpts(id),
  }
}
