import { isFormatId, FormatId } from '@/format'

type Prefix = 'simple' | 'fancy-0' | 'fancy-1' | 'fancy-2'

type CustomFormat = {
  prefix: Prefix
  name: string
  start: string
  tab: string
  tabDelimiter: string
  end: string
}

// used by offscreen doc
export function getV3Data() {
  const notifyOnCopy = get('copy-notification') === 'toaster' || get('copy-notification') === 'both'

  const ignorePinnedTabs = get('ignore-pinned-tabs') === 'true'

  const showContextMenu = get('show-in-context-menu') !== 'false'

  const selectedPrefix: Prefix =
    get('mode') === 'simple' // wrap
      ? 'simple'
      : (get('selected-prefix') as Prefix | null) || 'fancy-0'

  const oldDefaultFormatId = getOldFormatId(selectedPrefix)

  let separator: string | null = null

  // unlike v3, v4 does not support multiple titleUrl1Line formats; we can only inherit from one
  if (oldDefaultFormatId === 'compact') {
    separator = get(`${selectedPrefix}-compact-separator`)
  } else {
    if (get('mode') !== 'simple') {
      for (const prefix of ['fancy-0', 'fancy-1', 'fancy-2'] as const) {
        if (getOldFormatId(prefix) === 'compact') {
          separator = get(`${prefix}-compact-separator`)
          break
        }
      }
    }
  }

  let includeHeader: boolean = false

  // unlike v3, v4 does not support multiple htmlTable formats; we can only inherit from one
  if (oldDefaultFormatId === 'html-table') {
    includeHeader = get(`${selectedPrefix}-html-table-include-header`) === 'true'
  } else {
    if (get('mode') !== 'simple') {
      for (const prefix of ['fancy-0', 'fancy-1', 'fancy-2'] as const) {
        if (getOldFormatId(prefix) === 'html-table') {
          includeHeader = get(`${prefix}-html-table-include-header`) === 'true'
          break
        }
      }
    }
  }

  const defaultFormatId: FormatId =
    oldDefaultFormatId === 'custom'
      ? `custom-${selectedPrefix}` // migration uses second part of this id to map to id of created custom format
      : getFormatId(oldDefaultFormatId)

  const customFormats: CustomFormat[] = []

  for (const prefix of ['simple', 'fancy-0', 'fancy-1', 'fancy-2'] as const) {
    if (getOldFormatId(prefix) === 'custom') {
      customFormats.push(getCustomFormat(prefix))
    }
  }

  return {
    notifyOnCopy,
    ignorePinnedTabs,
    showContextMenu,
    separator,
    includeHeader,
    defaultFormatId,
    customFormats,
  }
}

export async function migrateV3Data(v3Data: ReturnType<typeof getV3Data>) {
  console.log('migrating v3 data...')
}

// may return "none"
function getOldFormatId(prefix: Prefix): string {
  const formatId = get(`${prefix}-copy-format`)

  if (formatId) {
    // check value aliases

    if (formatId === 'txt1Line' || formatId === 'condensed') {
      return 'compact'
    }

    if (formatId === 'txt2Lines') {
      return 'expanded'
    }

    if (formatId === 'txtUrlOnly') {
      return 'url'
    }

    return formatId
  }

  if (prefix === 'fancy-1') {
    return 'compact'
  }

  if (prefix === 'fancy-2') {
    return 'link'
  }

  return 'expanded'
}

function getFormatId(oldFormatId: string): FormatId {
  if (oldFormatId === 'compact') {
    return 'titleUrl1Line'
  }

  if (oldFormatId === 'expanded') {
    return 'titleUrl2Line'
  }

  if (oldFormatId === 'html-table') {
    return 'htmlTable'
  }

  if (isFormatId(oldFormatId)) {
    return oldFormatId
  }

  return 'link'
}

function getCustomFormat(prefix: Prefix): CustomFormat {
  return {
    prefix,
    name: get(`${prefix}-custom-name`) ?? 'My format',
    start: get(`${prefix}-custom-start`) ?? '[date][n][n]',
    tab: get(`${prefix}-custom-tab`) ?? '[#]) Title: [title][n]   URL:   [url]',
    tabDelimiter: get(`${prefix}-custom-delimiter`) ?? '[n][n]',
    end: get(`${prefix}-custom-end`) ?? '',
  }
}

function get(key: string) {
  const val = window.localStorage.getItem(key)

  if (val === null) {
    // check aliases

    if (key === 'simple-copy-format') {
      return get('tab-format')
    }

    if (key === 'tab-format') {
      return get('format')
    }

    if (key === 'simple-compact-separator') {
      return get('tab-format-delimiter')
    }

    if (key === 'tab-format-delimiter') {
      return get('condensed-separator')
    }

    if (key === 'simple-html-table-include-header') {
      return get('html-table-include-header')
    }

    if (key === 'simple-custom-tab') {
      return get('tab-format-template')
    }

    if (key === 'tab-format-template') {
      return get('custom-tab-template')
    }

    if (key === 'simple-custom-start') {
      return get('custom-start')
    }

    if (key === 'simple-custom-end') {
      return get('custom-end')
    }

    if (key === 'simple-custom-delimiter') {
      return get('custom-delimiter')
    }
  }

  return val
}
