import { TabScopeId } from '@/scope'

type TabPredicate = (tab: chrome.tabs.Tab) => boolean

export async function getWindowsAndTabs(filter?: TabPredicate) {
  const windows = await chrome.windows.getAll({ populate: true })

  if (!filter) return windows

  return windows
    .map((win) => ({
      ...win,
      tabs: (win.tabs ?? []).filter((tab) => filter(tab)),
    }))
    .filter(({ tabs }) => tabs.length)
}

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
