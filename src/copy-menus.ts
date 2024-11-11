import { isFormatId, FormatId } from '@/format'
import { getConfiguredFormats, getConfiguredFormat, ConfiguredFormat } from '@/configured-format'
import { getRepresentationsForTabs } from '@/copy'
import { getOption } from '@/options'
import { getDefaultFormatId, setCopyStatus } from '@/storage'
import { offscreenActions } from '@/offscreen-actions'
import { contextMenu, Context, MenuNode } from '@/util/context-menu'
import { getDummyTab } from '@/util/tabs'
import { sentenceCase } from '@/util/string'
import { intl } from '@/intl'

// contexts for copy menus must be mutually exclusive such that only one appears at a time; contexts that can coincide (eg `link` and `image`) need to be colocated.
// - notable contexts:
//   - `selection`: tricky because we don't want to show nothing on selections but a selection can coincide with a link, so `selection` must be a `copyItem` menu context. this introduces the quirky possibility for a `Copy` menu to have only one submenu item `Tab` or `Tab as` when the click target is a simple text selection.
//   - `editable`: most commonly a text input but may be a content-editable element, in which case could contain link or src items and as such needs to be a `copyItem` menu context. this introduces the quirky possibility for a `Copy` menu to have only one submenu item `Tab` or `Tab as` when the content-editable's click target is not a link or src item.
//   - `frame`: excluded because we want the same behavior in frames as in pages

const COPY_TAB_MENU_ID = 'copyTab'
const COPY_ITEM_MENU_ID = 'copyItem'

const copyMenus = [
  {
    id: COPY_TAB_MENU_ID,
    contexts: ['page'],
  },
  {
    // link, image, etc
    id: COPY_ITEM_MENU_ID,
    contexts: [
      // wrap
      'link',
      'selection',
      'editable',
      'image',
      'video',
      'audio',
    ],
  },
] as const satisfies { id: string; contexts: Context[] }[]

type CopyMenuId = (typeof copyMenus)[number]['id']

function isCopyMenuId(id: string): id is CopyMenuId {
  return copyMenus.some((menu) => menu.id === id)
}

// an item on a page that can be copied through copy menus
const copyItems = ['link', 'image', 'video', 'audio'] as const

type CopyItem = (typeof copyItems)[number]

// something that can be copied through copy menus
const copySubjects = ['tab', ...copyItems] as const

export type CopySubject = (typeof copySubjects)[number]

function isCopySubject(subject: string): subject is CopySubject {
  return (copySubjects as ReadonlyArray<string>).includes(subject)
}

// --- menu cache ---

// menu cache provides a convenient form for accessing menu metadata while avoiding redundancy in `copyMenus` spec

type CopyMenuCache = {
  [k in CopyMenuId]: {
    id: k
    contexts: Extract<(typeof copyMenus)[number], { id: k }>['contexts']
    menu: ReturnType<typeof contextMenu>
  }
}

let copyMenuCache: CopyMenuCache | null = null

function getCopyMenus() {
  return (copyMenuCache ||= Object.fromEntries(
    copyMenus.map(({ id, contexts }) => [
      id,
      {
        id,
        contexts,
        menu: contextMenu(id),
      },
    ]),
  ) as CopyMenuCache)
}

// --- menu click handling ---

// determines action based on clicked menu item id
export async function handleMenuAction(
  { menuItemId, linkUrl, srcUrl }: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab,
) {
  // console.log('menu click', JSON.stringify({ menuItemId, linkUrl, srcUrl, tab }, undefined, 2))

  const { copySubject, formatId } =
    menuItemId === COPY_TAB_MENU_ID
      ? {
          copySubject: 'tab' as const,
          formatId: await getDefaultFormatId(),
        }
      : parseActionMenuId(`${menuItemId}`)

  const tabToCopy =
    copySubject === 'tab'
      ? tab
      : getCopyItemTab({
          copyItem: copySubject,
          linkUrl,
          srcUrl,
        })

  if (!tabToCopy) {
    throw new Error(`invalid copy subject "${copySubject}" or corresponding data`)
  }

  const format = await getConfiguredFormat(formatId)

  if (!format) {
    throw new Error(`invalid format ${formatId}`)
  }

  const copyStatusProps = {
    type: copySubject,
    count: 1,
    formatId: format.id,
  } as const

  try {
    // use offscreen action because extension service workers do not have direct access to the Clipboard API
    const success = await offscreenActions.copyToClipboard(
      getRepresentationsForTabs({
        tabs: [tabToCopy],
        format,
      }),
    )

    setCopyStatus({
      status: success ? 'success' : 'fail',
      ...copyStatusProps,
    })
  } catch (ex) {
    console.error('failed to copy to clipboard (error sending offscreen action).', ex)

    setCopyStatus({
      status: 'fail',
      ...copyStatusProps,
    })
  }

  // get copy item in tab form
  function getCopyItemTab({
    copyItem,
    linkUrl,
    srcUrl,
  }: {
    copyItem: CopyItem
    linkUrl?: string
    srcUrl?: string
  }): chrome.tabs.Tab | undefined {
    if (copyItem === 'link' && linkUrl) {
      return getDummyTab({
        url: linkUrl,
      })
    }

    if (['image', 'video', 'audio'].includes(copyItem) && srcUrl) {
      return getDummyTab({
        url: srcUrl,
      })
    }
  }
}

// --- menu refresh ---

export async function refreshMenus() {
  const {
    // wrap
    copyTab: copyTabMenu,
    copyItem: copyItemMenu,
  } = getCopyMenus()

  const enableContextMenu = (await getOption('showContextMenu')).value

  if (!enableContextMenu) {
    await Promise.all([copyTabMenu.menu.remove(), copyItemMenu.menu.remove()])
    return
  }

  const provideFormatSelection = (await getOption('provideContextMenuFormatSelection')).value

  if (provideFormatSelection) {
    const formats = await getConfiguredFormats({ visibleOnly: true })

    await copyTabMenu.menu.refresh({
      title: sentenceCase(intl.copyTabAs()),
      contexts: copyTabMenu.contexts,
      items: getFormatMenuItems({
        formats,
        copyMenuId: copyTabMenu.id,
        copySubject: 'tab',
      }),
    })

    const formatMenuItemsProps = {
      formats,
      copyMenuId: copyItemMenu.id,
    }

    await copyItemMenu.menu.refresh({
      title: sentenceCase(intl.copy()),
      contexts: copyItemMenu.contexts,
      items: [
        {
          title: sentenceCase(intl.tabAs()),
          items: getFormatMenuItems({
            ...formatMenuItemsProps,
            copySubject: 'tab',
          }),
        },
        {
          title: sentenceCase(intl.linkAs()),
          contexts: ['link'],
          items: getFormatMenuItems({
            ...formatMenuItemsProps,
            copySubject: 'link',
          }),
        },
        {
          title: sentenceCase(intl.imageAs()),
          contexts: ['image'],
          items: getFormatMenuItems({
            ...formatMenuItemsProps,
            copySubject: 'image',
          }),
        },
        {
          title: sentenceCase(intl.videoAs()),
          contexts: ['video'],
          items: getFormatMenuItems({
            ...formatMenuItemsProps,
            copySubject: 'video',
          }),
        },
        {
          title: sentenceCase(intl.audioAs()),
          contexts: ['audio'],
          items: getFormatMenuItems({
            ...formatMenuItemsProps,
            copySubject: 'audio',
          }),
        },
      ],
    })
  } else {
    await copyTabMenu.menu.refresh({
      title: sentenceCase(intl.copyTab()),
      contexts: copyTabMenu.contexts,
    })

    const actionMenuIdProps = {
      copyMenuId: copyItemMenu.id,
      formatId: await getDefaultFormatId(),
    }

    await copyItemMenu.menu.refresh({
      title: sentenceCase(intl.copy()),
      contexts: copyItemMenu.contexts,
      items: [
        {
          title: sentenceCase(intl.tab()),
          id: createActionMenuId({
            copySubject: 'tab',
            ...actionMenuIdProps,
          }),
        },
        {
          title: sentenceCase(intl.link()),
          contexts: ['link'],
          id: createActionMenuId({
            copySubject: 'link',
            ...actionMenuIdProps,
          }),
        },
        {
          title: sentenceCase(intl.image()),
          contexts: ['image'],
          id: createActionMenuId({
            copySubject: 'image',
            ...actionMenuIdProps,
          }),
        },
        {
          title: sentenceCase(intl.video()),
          contexts: ['video'],
          id: createActionMenuId({
            copySubject: 'video',
            ...actionMenuIdProps,
          }),
        },
        {
          title: sentenceCase(intl.audio()),
          contexts: ['audio'],
          id: createActionMenuId({
            copySubject: 'audio',
            ...actionMenuIdProps,
          }),
        },
      ],
    })
  }

  function getFormatMenuItems({
    formats,
    copyMenuId,
    copySubject,
  }: {
    formats: ConfiguredFormat[]
    copyMenuId: CopyMenuId
    copySubject: CopySubject
  }): MenuNode[] {
    return formats.map((format) => ({
      id: createActionMenuId({
        copyMenuId,
        copySubject,
        formatId: format.id,
      }),
      title: format.label.replace(/&/g, '&&'), // escape ampersand to avoid Windows interpreting it as an accelerator key. ok to keep for MacOS. todo: interestingly, while this renders correctly it still creates an accelerator for the character following the &; is this a chrome bug or are we escaping it incorrectly?
    }))
  }
}

// --- action menu id helpers ---

// don't use '-' (used by custom format ids)
const menuIdDelimiter = '/'

type ActionMenuIdParts = {
  copyMenuId: CopyMenuId
  copySubject: CopySubject
  formatId: FormatId
}

type ActionMenuId =
  `${ActionMenuIdParts['copyMenuId']}${typeof menuIdDelimiter}${ActionMenuIdParts['copySubject']}${typeof menuIdDelimiter}${ActionMenuIdParts['formatId']}`

function createActionMenuId({
  copyMenuId,
  copySubject,
  formatId,
}: ActionMenuIdParts): ActionMenuId {
  return `${copyMenuId}${menuIdDelimiter}${copySubject}${menuIdDelimiter}${formatId}`
}

function parseActionMenuId(id: string): ActionMenuIdParts {
  const [copyMenuId, copySubject, formatId] = id.split(menuIdDelimiter)

  if (!isCopyMenuId(copyMenuId) || !isCopySubject(copySubject) || !isFormatId(formatId)) {
    throw new Error(`invalid action menu id ${id}`)
  }

  return {
    copyMenuId,
    copySubject,
    formatId,
  }
}
