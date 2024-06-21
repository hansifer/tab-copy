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

  primary: () => 'primary',

  // ----- format option -----

  separator: () => 'separator',

  includeHeader: () => 'include header',

  name: () => 'name',

  header: () => 'header',

  delimiter: () => 'delimiter',

  footer: () => 'footer',

  confirmDelete: () => 'Are you sure you want to delete this format?',

  // ----- options page -----

  tabCopyOptions: () => 'tab copy options',

  formats: () => 'formats',

  formatReorderInstructions: () =>
    'drag a format up or down to change its order in the copy popup.',

  formatMakeUnselectableInstructions: () => "uncheck formats you don't want to see in the popup.",

  formatSetPrimaryInstructions: () => 'the primary format can be changed in the popup.',

  addFormat: () => 'add format',

  // ----- options (key must match key in `options` object in `@/options`) -----

  confirmCopyWithNotification: () => 'confirm copy with notification',

  ignorePinnedTabs: () => 'ignore pinned tabs',

  showInContextMenu: () => 'show in context menu',

  grayscaleIcon: () => 'grayscale icon',

  shortcutKey: () => 'shortcut key',

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
