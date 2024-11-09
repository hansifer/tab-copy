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
    copyLabel: (formatLabel?: string) => intl.copySelectedTabs(formatLabel),
    description: () => intl.selectedTabsDescription(),
  },
  {
    id: 'window-tabs',
    label: () => intl.thisWindowsTabs(),
    copyLabel: (formatLabel?: string) => intl.copyWindowTabs(formatLabel),
    description: () => intl.thisWindowsTabsDescription(),
  },
  {
    id: 'all-tabs',
    label: () => intl.allTabs(),
    copyLabel: (formatLabel?: string) => intl.copyAllTabs(formatLabel),
    description: () => intl.allTabsDescription(),
  },
  {
    id: 'all-windows-and-tabs',
    label: () => intl.allWindowsAndTabs(),
    copyLabel: (formatLabel?: string) => intl.copyAllWindowsAndTabs(formatLabel),
    description: () => intl.allWindowsAndTabsDescription(),
  },
] as const satisfies ScopeTemplate[]

type ScopeTemplate = {
  id: string
  label: (tabsInfo?: TabsInfo) => string
  copyLabel: (formatLabel?: string) => string
  description?: () => string
}

type TabsInfo = {
  highlightedTabCount?: number // count of highlighted tabs in the current window
}

export function isTabScopeId(id: ScopeId): id is TabScopeId {
  return id !== 'all-windows-and-tabs'
}
