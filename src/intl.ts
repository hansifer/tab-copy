import { MIN_VISIBLE_FORMAT_COUNT } from '@/format'

export const intl = {
  // ----- copying  -----

  copy: () => 'copy',

  copyAs: () => 'copy as',

  copy1xAs: () => 'copy 1x as',

  holdWhenCopying: (modifierKey: string) => `hold ${modifierKey} when copying`,

  copyTab: () => 'copy tab',

  copyTabAs: () => 'copy tab as',

  tabAs: () => 'tab as',

  linkAs: () => 'link as',

  imageAs: () => 'image as',

  videoAs: () => 'video as',

  audioAs: () => 'audio as',

  image: (count = 1) => (count === 1 ? 'image' : 'images'),

  video: (count = 1) => (count === 1 ? 'video' : 'videos'),

  audio: (count = 1) => (count === 1 ? 'audio' : 'audios'),

  copySuccess: ({
    // wrap
    count,
    typeLabel,
    formatLabel,
  }: {
    count?: number
    typeLabel: (count?: number) => string
    formatLabel?: string
  }) =>
    `${count ? `${count} ` : ''}${typeLabel(count)} copied${formatLabel ? ` as ${formatLabel}` : ''}`,

  copyFail: () => 'copy failed',

  // ----- copy scope -----

  copySelectedTabs: (formatLabel?: string): string =>
    formatLabel // wrap
      ? `${intl.copySelectedTabs()} as ${formatLabel}`
      : 'copy selected tabs',

  copyWindowTabs: (formatLabel?: string): string =>
    formatLabel // wrap
      ? `${intl.copyWindowTabs()} as ${formatLabel}`
      : 'copy window tabs',

  copyAllTabs: (formatLabel?: string): string =>
    formatLabel // wrap
      ? `${intl.copyAllTabs()} as ${formatLabel}`
      : 'copy all tabs',

  copyAllWindowsAndTabs: (formatLabel?: string): string =>
    formatLabel // wrap
      ? `${intl.copyAllWindowsAndTabs()} as ${formatLabel}`
      : 'copy all tabs by window',

  thisTab: () => 'this tab',

  selectedTabs: () => 'selected tabs',

  selectedTabsDescription: () =>
    'selected tabs in\nthe current window\n(usually just the current tab)',

  thisWindowsTabs: () => "this window's tabs",

  thisWindowsTabsDescription: () => 'all tabs in the current window',

  allTabs: () => 'all tabs',

  allTabsDescription: () => 'all tabs, ungrouped',

  allWindowsAndTabs: () => 'all tabs by window',

  allWindowsAndTabsDescription: () => 'all tabs, grouped by window',

  noTabsFound: () => 'No tabs found. Check filtering options.',

  // ----- copy format -----

  linkDescription: (plaintextFormatLabel: string) =>
    `clickable links when pasting into documents or emails.\n${plaintextFormatLabel} otherwise.`,

  titleUrl1LineDescription: () => 'tab title and URL on a single line',

  titleUrl2LineDescription: () => 'tab title and URL on separate lines',

  title: () => 'title',

  url: () => 'URL',

  csvDescription: () => 'comma-separated values',

  htmlTable: () => 'HTML table',

  customDescription: () => 'a format you created',

  default: () => 'default',

  // ----- format opts -----

  formatOpts: () => 'format options',

  separator: () => 'separator',

  includeHeader: () => 'include header',

  plaintextFallback: () => 'plaintext fallback',

  properties: () => 'properties',

  layout: () => 'layout',

  pretty: () => 'pretty',

  indent: () => 'indent',

  name: () => 'name',

  start: () => 'start',

  windowStart: () => 'window start',

  tabDelimiter: () => 'tab delimiter',

  windowEnd: () => 'window end',

  windowDelimiter: () => 'window delimiter',

  end: () => 'end',

  insert: () => 'insert',

  preview: () => 'preview',

  deleteFormat: () => 'delete format',

  confirmDelete: () => 'are you sure you want to delete this format?',

  minVisibleFormatDeleteError: () =>
    `this format cannot be deleted\nbecause it is one of only ${MIN_VISIBLE_FORMAT_COUNT} visible formats`,

  genericFormatDeleteError: () => 'unable to delete this format',

  // ----- options page -----

  options: () => 'options',

  tabCopyOptions: () => 'tab copy options',

  ranges: () => 'ranges',

  format: (count = 1) => (count === 1 ? 'format' : 'formats'),

  formats: () => intl.format(2),

  optionTipText: {
    copyButtonScopes: () => 'each button in the Tab Copy popup\ncopies a particular range of tabs.',

    hiddenScopes: () =>
      "uncheck the ranges you don't need\n(at least 1 range must remain checked).",

    defaultScope: () => 'if the popup is disabled,\nthe top checked range is used.',

    formatOrder: () => 'drag a format up or down\nto change its order in the popup.',

    hiddenFormats: () =>
      "uncheck formats you don't need\n(at least 3 formats must remain checked).",

    defaultFormat: () => 'the top checked format is the default format.',
  },

  addFormat: () => 'add format',

  // ----- options -----

  enablePopup: () => 'enable popup',

  enablePopupDescription: () =>
    'show a popup when activating Tab Copy instead of copying tabs immediately',

  showTabCounts: () => 'show tab counts',

  showTabCountsDescription: () => 'show how many tabs\nwill be copied',

  keepFormatSelectorExpanded: () => 'keep format selector expanded',

  keepFormatSelectorExpandedDescription: () => 'always show\nall available formats',

  showHeaderIcons: () => 'show header icons',

  showHeaderIconsDescription: () => 'show icons for options, docs,\nand supporting Tab Copy',

  enableContextMenu: () => 'enable context menu',

  enableContextMenuDescription: () => 'include a Tab Copy action in\nthe context menu of web pages',

  provideContextMenuFormatSelection: () => 'provide format selection',

  provideContextMenuFormatSelectionDescription: () =>
    'select a format when copying instead of using the default',

  ignorePinnedTabs: () => 'ignore pinned tabs',

  ignorePinnedTabsDescription: () => 'omit pinned tabs from\nthe tabs that are copied',

  notifyOnCopy: () => 'notify on copy',

  notifyOnCopyDescription: () => 'show a notification\nwhenever tabs are copied',

  invertIcon: () => 'invert icon color',

  invertIconDescription: () => 'adjust the Tab Copy icon\ncolor for best visibility',

  editKeyboardShortcuts: () => 'edit keyboard shortcuts...',

  // ----- modifier keys -----

  alt: () => 'alt',

  ctrl: () => 'ctrl',

  shift: () => 'shift',

  modifierKey: (...keys: string[]) => keys.join('+'),

  // ----- misc -----

  conjoin: (...items: string[]) => items.join(' & '),

  window: (count = 1) => (count === 1 ? 'window' : 'windows'),

  tab: (count = 1) => (count === 1 ? 'tab' : 'tabs'),

  link: (count = 1) => (count === 1 ? 'link' : 'links'),

  ok: () => 'OK',

  cancel: () => 'cancel',

  yes: () => 'yes',

  no: () => 'no',

  hidden: () => 'hidden',

  delete: () => 'delete',

  unknown: () => 'unknown',
}
