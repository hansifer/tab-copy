import { ScopeId, isTabScopeId } from '@/scope'
import { Transforms } from '@/format'
import { ConfiguredFormat } from '@/configured-format'
import { clipboardWrite } from '@/util/clipboard'
import { getWindowsAndTabs, getTabs, TabPredicate } from '@/util/tabs'
import { log } from '@/util/log'

export async function copy(scopeId: ScopeId, format: ConfiguredFormat, filterPinnedTabs?: boolean) {
  log(`copying scope ${scopeId}...`, { separate: true })

  const filter: TabPredicate | undefined = filterPinnedTabs // wrap
    ? ({ pinned }) => !pinned
    : undefined

  return isTabScopeId(scopeId)
    ? copyHelper(await getTabs(scopeId, filter), applyTextTransformToTabs, format)
    : copyHelper(await getWindowsAndTabs(filter), applyTextTransformToWindows, format)
}

// TS helper
async function copyHelper<T extends chrome.tabs.Tab[] | chrome.windows.Window[]>(
  items: T,
  applyTextTransform: (
    items: T,
    transforms: Transforms,
    representation: 'text' | 'html',
    formatName: string,
  ) => string,
  format: ConfiguredFormat,
) {
  const { label, transforms } = format

  // todo: generate and normalize nxs output

  await clipboardWrite({
    text: applyTextTransform(items, transforms, 'text', label),
    ...(transforms.html ? { html: applyTextTransform(items, transforms, 'html', label) } : null),
    // ...(transforms.nxs ? { nxs: nxsTransform(items, transforms.nxs) } : null), // todo: use separate nxsTransform per scopeType?
  })
}

function applyTextTransformToTabs(
  tabs: chrome.tabs.Tab[],
  transforms: Transforms,
  representation: 'text' | 'html',
  formatName: string,
) {
  const transform = transforms[representation]

  if (!transform) {
    throw new Error(`no transform for ${representation} in format "${formatName}"`)
  }

  if (!tabs.length) {
    console.warn(`no tabs to copy as "${formatName}" ${representation}. check filter options.`)
  } else {
    log(
      `transforming ${tabs.length} ${
        tabs.length === 1 ? 'tab' : 'tabs'
      } to "${formatName}" ${representation}`,
    )
  }

  return `${
    transform.start?.({
      formatName,
      tabCount: tabs.length,
      scopeType: 'tab',
    }) ?? ''
  }${tabs
    .map((tab, i) => transform.tab?.({ tab, globalSeq: i + 1 }) ?? '')
    .join(transform.tabDelimiter ?? '')}${
    transform.end?.({
      formatName,
      tabCount: tabs.length,
    }) ?? ''
  }`
}

function applyTextTransformToWindows(
  windows: chrome.windows.Window[],
  transforms: Transforms,
  representation: 'text' | 'html',
  formatName: string,
) {
  const transform = transforms[representation]

  if (!transform) {
    throw new Error(`no transform for ${representation} in format "${formatName}"`)
  }

  if (!windows.length) {
    console.warn(`no windows to copy as "${formatName}" ${representation}. check filter options.`)
  } else {
    log(
      `transforming ${windows.length} ${
        windows.length === 1 ? 'window' : 'windows'
      } to "${formatName}" ${representation}`,
    )
  }

  const allTabs = windows.flatMap(({ tabs }) => tabs).filter((tab): tab is chrome.tabs.Tab => !!tab)

  let globalSeq = 1

  return `${
    transform.start?.({
      formatName,
      windowCount: windows.length,
      tabCount: allTabs.length,
      scopeType: 'window',
    }) ?? ''
  }${windows
    .map(
      (window, wi) =>
        `${
          transform.windowStart?.({
            window,
            seq: wi + 1,
            windowTabCount: (window.tabs ?? []).length,
          }) ?? ''
        }${(window.tabs ?? [])
          .map(
            (tab, ti) =>
              transform.tab?.({
                tab,
                globalSeq: globalSeq++,
                windowTabSeq: ti + 1,
                windowSeq: wi + 1,
              }) ?? '',
          )
          .join(transform.tabDelimiter ?? '')}${
          transform.windowEnd?.({
            window,
            seq: wi + 1,
            windowTabCount: (window.tabs ?? []).length,
          }) ?? ''
        }`,
    )
    .join(transform.windowDelimiter ?? '')}${
    transform.end?.({
      formatName,
      windowCount: windows.length,
      tabCount: allTabs.length,
    }) ?? ''
  }`
}
