import { TabScopeId, ScopeId } from '@/scope'

const filterImpactingTabProps: (keyof chrome.tabs.Tab)[] = [
  // wrap
  'pinned',
  'url',
  'title',
  'groupId',
]

export type TabPredicate = (tab: chrome.tabs.Tab) => boolean

// - excludes tabs without URL (possible?)
// - excludes windows without tabs (possible with filter)
// - may return empty array
export async function getWindowsAndTabs(filter?: TabPredicate) {
  const windows = await chrome.windows.getAll({ populate: true })

  return windows
    .map((win) => ({
      ...win,
      tabs: (win.tabs ?? []).filter((tab) => tab.url && (!filter || filter(tab))),
    }))
    .filter(({ tabs }) => tabs.length)
}

// - ignores filter for scope `highlighted-tabs`
// - may return empty array
export async function getTabs(scopeId: TabScopeId = 'all-tabs', filter?: TabPredicate) {
  if (scopeId === 'all-tabs') {
    const { allTabs } = await getWindowsAndAllTabs(filter)
    return allTabs
  }

  const { unfilteredWindowTabs, filteredWindowTabs } = await getWindowTabs(filter)

  if (scopeId === 'window-tabs') {
    return filteredWindowTabs
  }

  // `highlighted-tabs` scope is not subject to filtering
  return unfilteredWindowTabs.filter(({ highlighted }) => !!highlighted)
}

// gets counts for all scopes
// - `all-windows-and-tabs` is window count
// - `highlighted-tabs` is not subject to filtering
export async function getWindowAndTabCounts(
  filter?: TabPredicate,
): Promise<{ [k in ScopeId]: number }> {
  const { windows, allTabs } = await getWindowsAndAllTabs(filter)
  const { unfilteredWindowTabs, filteredWindowTabs } = await getWindowTabs(filter)
  const highlightedTabs = unfilteredWindowTabs.filter(({ highlighted }) => !!highlighted)

  return {
    'highlighted-tabs': highlightedTabs.length,
    'window-tabs': filteredWindowTabs.length,
    'all-tabs': allTabs.length,
    'all-windows-and-tabs': windows.length,
  }
}

export function onTabCountChanged(callback: () => void, debounce = 500) {
  let timeout: number

  const debouncedCallback = () => {
    clearTimeout(timeout)
    timeout = window.setTimeout(callback, debounce)
  }

  const onUpdatedListener: Parameters<typeof chrome.tabs.onUpdated.addListener>[0] = (
    _,
    changeInfo,
  ) => {
    if (filterImpactingTabProps.some((prop) => changeInfo.hasOwnProperty(prop))) {
      debouncedCallback()
    }
  }

  const listener = () => {
    debouncedCallback()
  }

  chrome.tabs.onUpdated.addListener(onUpdatedListener)
  chrome.tabs.onCreated.addListener(listener)
  chrome.tabs.onRemoved.addListener(listener)
  chrome.tabs.onDetached.addListener(listener)
  chrome.tabs.onAttached.addListener(listener)
  chrome.tabs.onMoved.addListener(listener)
  chrome.tabs.onActivated.addListener(listener)
  chrome.tabs.onHighlighted.addListener(listener)
  chrome.windows.onCreated.addListener(listener)
  chrome.windows.onRemoved.addListener(listener)

  return () => {
    chrome.tabs.onUpdated.removeListener(onUpdatedListener)
    chrome.tabs.onCreated.removeListener(listener)
    chrome.tabs.onRemoved.removeListener(listener)
    chrome.tabs.onDetached.removeListener(listener)
    chrome.tabs.onAttached.removeListener(listener)
    chrome.tabs.onMoved.removeListener(listener)
    chrome.tabs.onActivated.removeListener(listener)
    chrome.tabs.onHighlighted.removeListener(listener)
    chrome.windows.onCreated.removeListener(listener)
    chrome.windows.onRemoved.removeListener(listener)
  }
}

let itemId = 1

// used for previews
export function getDummyWindow({
  id = itemId++,
  tabs = [
    getDummyTab({
      windowId: id,
    }),
  ],
}: {
  id?: number
  tabs?: chrome.tabs.Tab[]
} = {}): chrome.windows.Window {
  return {
    id,
    focused: false,
    alwaysOnTop: false,
    incognito: false,
    state: 'normal',
    type: 'normal',
    tabs,
  }
}

// used for previews and context-menu based link and src copy
export function getDummyTab({
  id = itemId++,
  title,
  url = 'https://example.com',
  favIconUrl,
  index = 0,
  windowId = 1,
  active = false,
}: {
  id?: number
  title?: string
  url?: string
  favIconUrl?: string
  index?: number
  windowId?: number
  active?: boolean
} = {}): chrome.tabs.Tab {
  return {
    id,
    title,
    url,
    favIconUrl,
    index,
    pinned: false,
    active,
    highlighted: active,
    selected: active,
    windowId,
    incognito: false,
    discarded: false,
    autoDiscardable: false,
    groupId: -1,
  }
}

async function getWindowsAndAllTabs(filter?: TabPredicate) {
  const windows = await getWindowsAndTabs(filter)
  const allTabs = windows.flatMap(({ tabs }) => tabs).filter((tab) => !!tab)

  return { windows, allTabs }
}

async function getWindowTabs(filter?: TabPredicate) {
  const unfilteredWindowTabs = (await chrome.tabs.query({ currentWindow: true })).filter(
    (tab) => tab.url,
  )

  const filteredWindowTabs = unfilteredWindowTabs.filter((tab) => !filter || filter(tab))

  return { unfilteredWindowTabs, filteredWindowTabs }
}
