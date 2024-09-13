import { intl } from '@/intl'

export const MIN_VISIBLE_SCOPE_COUNT = 1

export type ScopeType = 'window' | 'tab'

export type Scope = (typeof scopes)[number]
export type ScopeId = Scope['id']
export type TabScopeId = Exclude<ScopeId, 'all-windows-and-tabs'>

export const scopes = [
  {
    id: 'highlighted-tabs',
    label: ({ highlightedTabCount } = {}) =>
      highlightedTabCount === 1 // wrap
        ? intl.thisTab()
        : intl.selectedTabs(),
    description: () => intl.selectedTabsDescription(),
  },
  {
    id: 'window-tabs',
    label: () => intl.thisWindowsTabs(),
    description: () => intl.thisWindowsTabsDescription(),
  },
  {
    id: 'all-tabs',
    label: () => intl.allTabs(),
    description: () => intl.allTabsDescription(),
  },
  {
    id: 'all-windows-and-tabs',
    label: () => intl.allWindowsAndTabs(),
    description: () => intl.allWindowsAndTabsDescription(),
  },
] as const satisfies ScopeTemplate[]

type ScopeTemplate = {
  id: string
  label: (tabsInfo?: TabsInfo) => string
  description?: () => string
}

type TabsInfo = {
  highlightedTabCount?: number // count of highlighted tabs in the current window
}

export function isTabScopeId(id: ScopeId): id is TabScopeId {
  return id !== 'all-windows-and-tabs'
}
