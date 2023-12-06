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

  // options page

  tabCopyOptions: () => 'tab copy options',

  formats: () => 'formats',

  formatReorderInstructions: () =>
    'drag tiles to change the order of how formats will appear in the copy popup.',

  formatMakeUnselectableInstructions: () => "uncheck formats you don't want to see.",

  formatSetPrimaryInstructions: () => 'the primary format is selected in the copy popup.',

  // ----- options (key must match key in `options` object in `@/options`) -----

  confirmCopyWithPopup: () => 'confirm copy with popup',

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
}
