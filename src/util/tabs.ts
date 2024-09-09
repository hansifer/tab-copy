import { TabScopeId } from '@/scope'

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

// - may return empty array
export async function getTabs(scopeId: TabScopeId = 'all-tabs', filter?: TabPredicate) {
  const windows = await getWindowsAndTabs(filter)
  const allTabs = windows.flatMap(({ tabs }) => tabs).filter((tab) => !!tab)

  if (scopeId === 'all-tabs') {
    return allTabs
  }

  const currentWinId = (await chrome.windows.getCurrent()).id
  const windowTabs = allTabs.filter(({ windowId }) => windowId === currentWinId)

  if (scopeId === 'window-tabs') {
    return windowTabs
  }

  // scopeId === 'highlighted-tabs'
  return windowTabs.filter(({ highlighted }) => !!highlighted)
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
}): chrome.windows.Window {
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
  index = 0,
  windowId = 1,
  active = false,
}: {
  id?: number
  title?: string
  url?: string
  index?: number
  windowId?: number
  active?: boolean
}): chrome.tabs.Tab {
  return {
    id,
    title,
    url,
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
