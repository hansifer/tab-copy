import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json'

export default defineManifest({
  name: pkg.displayName,
  version: pkg.version,
  description: 'Quickly copy tabs to the clipboard in a variety of formats',
  manifest_version: 3,
  // https://developer.chrome.com/docs/extensions/reference/api/offscreen#before_chrome_116_check_if_an_offscreen_document_is_open
  minimum_chrome_version: '116',
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-32.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  options_page: 'options.html',
  // clipboardWrite is required for context menu and command-based copy. if not present, `document.execCommand('copy')` fails and returns false, even when Clipboard web perm is granted.
  permissions: ['tabs', 'storage', 'contextMenus', 'offscreen', 'clipboardWrite'],
  optional_permissions: ['notifications'],
  // optional_host_permissions: ['file:///*'],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
  commands: {
    // number prefix on keys ensures order in the Tab Copy keyboard shortcut card at chrome://extensions/shortcuts
    '1copy-highlighted-tabs': {
      description: 'Copy selected tabs',
    },
    '2copy-window-tabs': {
      description: "Copy the current window's tabs",
    },
    '3copy-all-tabs': {
      description: 'Copy all tabs, ungrouped',
    },
    '4copy-all-windows-and-tabs': {
      description: 'Copy all tabs, grouped by window',
    },
  },
})
