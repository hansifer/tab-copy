import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json'

export default defineManifest({
  name: 'Tab Copy',
  version: pkg.version,
  description: 'Quickly copy tabs to the clipboard in a variety of formats',
  manifest_version: 3,
  minimum_chrome_version: '90',
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
  permissions: ['tabs', 'contextMenus', 'storage'],
  optional_permissions: ['notifications'],
  // optional_host_permissions: ['file:///*'],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
})
