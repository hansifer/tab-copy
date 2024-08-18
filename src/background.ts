import { getOption } from '@/options'
import { makeStorageChangeHandler } from '@/storage'
import { log } from '@/util/log'

let actionIconFlashTimer: ReturnType<typeof setTimeout>

log(`service worker loaded ${new Date().toLocaleString()}`)

setIcon('logo')

chrome.runtime.onStartup.addListener(() => {
  setIcon('logo')
})

// listening for `copied` storage event instead of using `chrome.runtime` messaging because `window.close()` interrupts the message
chrome.storage.onChanged.addListener(
  makeStorageChangeHandler((changes) => {
    if (changes.copied) {
      clearTimeout(actionIconFlashTimer)

      setIcon('success')

      actionIconFlashTimer = setTimeout(() => {
        setIcon('logo')
      }, 1e3)
    }

    if (changes.options) {
      setIcon('logo')
    }
  }),
)

async function setIcon(name: 'logo' | 'success') {
  const filename =
    name === 'logo' // wrap
      ? (await getOption('grayIcon')).value
        ? 'logo-gray'
        : 'logo'
      : 'success'

  return chrome.action.setIcon({
    path: {
      16: `img/${filename}-16.png`,
      32: `img/${filename}-32.png`,
      48: `img/${filename}-48.png`,
      128: `img/${filename}-128.png`,
    },
  })
}
