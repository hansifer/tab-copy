export const MIN_VISIBLE_SCOPE_COUNT = 1

export const scopeIds = [
  'highlighted-tabs',
  'window-tabs',
  'all-tabs',
  'all-windows-and-tabs',
] as const

export type ScopeId = (typeof scopeIds)[number]
