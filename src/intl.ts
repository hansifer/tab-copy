import { MIN_SELECTABLE_FORMAT_COUNT } from '@/format'

export const intl = {
  // ----- copying  -----

  copy: () => 'copy',

  copyAs: () => 'copy as',

  copy1xAs: () => 'copy 1x as',

  holdWhenCopying: (keyModifier: string) => `hold ${keyModifier} when copying`,

  // ----- copy scope -----

  thisTab: () => 'this tab',

  selectedTabs: () => 'selected tabs',

  thisWindowsTabs: () => "this window's tabs",

  allTabs: () => 'all tabs',

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

  minSelectableFormatDeleteError: () =>
    `this format cannot be deleted\nbecause it is one of only ${MIN_SELECTABLE_FORMAT_COUNT} visible formats`,

  genericFormatDeleteError: () => 'unable to delete this format',

  // ----- options page -----

  tabCopyOptions: () => 'tab copy options',

  formats: () => 'formats',

  optionTipText: {
    'format-order': () => 'drag a format up or down to change its\norder in the Tab Copy popup.',

    'hidden-formats': () =>
      "uncheck formats you don't want to see\n(at least 3 formats must remain checked).",

    'default-format': () => 'the top visible format is the default format.',
  },

  addFormat: () => 'add format',

  // ----- options (key must match key in `options` object in `@/options`) -----

  notifyOnCopy: () => 'notify on copy',

  ignorePinnedTabs: () => 'ignore pinned tabs',

  showInContextMenu: () => 'show in context menu',

  grayscaleIcon: () => 'grayscale icon',

  editKeyboardShortcuts: () => 'edit keyboard shortcuts...',

  // ----- key modifiers -----

  alt: () => 'alt',

  ctrl: () => 'ctrl',

  shift: () => 'shift',

  keyModifier: (...keys: string[]) => keys.join('+'),

  // ----- misc -----

  conjoin: (...items: string[]) => items.join(' & '),

  tab: (count = 1) => (count === 1 ? 'tab' : 'tabs'),

  ok: () => 'OK',

  cancel: () => 'cancel',

  yes: () => 'yes',

  no: () => 'no',

  hidden: () => 'hidden',

  delete: () => 'delete',
}
