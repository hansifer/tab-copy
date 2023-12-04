import { makeStorageChangeHandler } from '@/storage'

let actionIconFlashTimer: ReturnType<typeof setTimeout>

console.log(`service worker loaded ${new Date().toLocaleString()}`)

// listening to `copied` storage event instead of using `chrome.runtime` messaging because `window.close()` interrupts the message
chrome.storage.onChanged.addListener(
  makeStorageChangeHandler((changes) => {
    if (changes.copied) {
      clearTimeout(actionIconFlashTimer)

      setIcon('success')

      actionIconFlashTimer = setTimeout(() => {
        setIcon('logo-gray')
      }, 1e3)
    }
  }),
)

function setIcon(name: 'success' | 'logo-gray') {
  chrome.action.setIcon({
    path: {
      16: `img/${name}-16.png`,
      32: `img/${name}-32.png`,
      48: `img/${name}-48.png`,
      128: `img/${name}-128.png`,
    },
  })
}
