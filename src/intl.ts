export const intl = {
  // ----- copying  -----

  copy: () => 'copy',

  copyAs: () => 'copy as',

  copy1xAs: () => 'copy 1x as',

  holdWhenCopying: (modifierKeys: string) => `hold ${modifierKeys} to use when copying`,

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

  // ----- options (key must match key in `options` object in `@/options`) -----

  confirmCopyWithPopup: () => 'confirm copy with popup',

  ignorePinnedTabs: () => 'ignore pinned tabs',

  showInContextMenu: () => 'show in context menu',

  grayscaleIcon: () => 'grayscale icon',

  shortcutKey: () => 'shortcut key',

  // ----- modifier keys -----

  alt: () => 'alt',

  ctrl: () => 'ctrl',

  shift: () => 'shift',

  modifierKeys: (...keys: string[]) => keys.join('+'),

  // ----- misc -----

  conjoin: (...items: string[]) => items.join(' & '),
}
