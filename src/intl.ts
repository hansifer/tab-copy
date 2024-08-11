import { MIN_VISIBLE_FORMAT_COUNT } from '@/format'

export const intl = {
  // ----- copying  -----

  copy: () => 'copy',

  copyAs: () => 'copy as',

  copy1xAs: () => 'copy 1x as',

  holdWhenCopying: (keyModifier: string) => `hold ${keyModifier} when copying`,

  // ----- copy scope -----

  thisTab: () => 'this tab',

  selectedTabs: () => 'selected tabs',

  selectedTabsDescription: () =>
    'selected tabs in\nthe current window\n(usually just the current tab)',

  thisWindowsTabs: () => "this window's tabs",

  thisWindowsTabsDescription: () => 'all tabs in the current window',

  allTabs: () => 'all tabs',

  allTabsDescription: () => 'all tabs, ungrouped',

  allWindowsAndTabs: () => 'all windows and tabs',

  allWindowsAndTabsDescription: () => 'all tabs, grouped by window',

  // ----- copy format -----

  link: () => 'link',

  title: () => 'title',

  url: () => 'URL',

  htmlTable: () => 'HTML table',

  default: () => 'default',

  // ----- format option -----

  separator: () => 'separator',

  includeHeader: () => 'include header',

  name: () => 'name',

  header: () => 'header',

  tabDelimiter: () => 'tab delimiter',

  footer: () => 'footer',

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

  format: (count = 1) => (count === 1 ? 'format' : 'formats'),

  formats: () => intl.format(2),

  optionTipText: {
    copyButtonScopes: () => 'each button in the Tab Copy popup\ncopies a particular range of tabs.',

    hiddenScopes: () =>
      "uncheck the buttons you don't want to see\n(at least 1 button must remain checked).",

    formatOrder: () => 'drag a format up or down to change its\norder in the Tab Copy popup.',

    defaultFormat: () => 'the top visible format is the default format.',

    hiddenFormats: () =>
      "uncheck formats you don't want to see\n(at least 3 formats must remain checked).",
  },

  addFormat: () => 'add format',

  // ----- options -----

  keepFormatSelectorExpanded: () => 'keep format selector expanded',

  keepFormatSelectorExpandedDescription: () =>
    'always show all available formats in the Tab Copy popup',

  showInContextMenu: () => 'show in context menu',

  showInContextMenuDescription: () => 'include a Tab Copy action in\nthe context menu of web pages',

  ignorePinnedTabs: () => 'ignore pinned tabs',

  ignorePinnedTabsDescription: () => 'omit pinned tabs from\nthe tabs that are copied',

  notifyOnCopy: () => 'notify on copy',

  notifyOnCopyDescription: () => 'show a notification\nwhenever tabs are copied',

  grayscaleIcon: () => 'grayscale icon',

  grayscaleIconDescription: () => 'change the style of\nthe Tab Copy icon',

  editKeyboardShortcuts: () => 'edit keyboard shortcuts...',

  // ----- key modifiers -----

  alt: () => 'alt',

  ctrl: () => 'ctrl',

  shift: () => 'shift',

  keyModifier: (...keys: string[]) => keys.join('+'),

  // ----- misc -----

  conjoin: (...items: string[]) => items.join(' & '),

  window: (count = 1) => (count === 1 ? 'window' : 'windows'),

  tab: (count = 1) => (count === 1 ? 'tab' : 'tabs'),

  ok: () => 'OK',

  cancel: () => 'cancel',

  yes: () => 'yes',

  no: () => 'no',

  hidden: () => 'hidden',

  delete: () => 'delete',
}
