import { getOptionValue } from '@/options'
import { makeStorageChangeHandler, getOption } from '@/storage'

let actionIconFlashTimer: ReturnType<typeof setTimeout>

console.log(`service worker loaded ${new Date().toLocaleString()}`)

overrideIcon()

chrome.runtime.onStartup.addListener(() => {
  overrideIcon()
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
      setIconPaths(getOptionValue('grayscaleIcon', changes.options.newValue) ? 'logo-gray' : 'logo')
    }
  }),
)

async function overrideIcon() {
  const grayscaleIcon = await getOption('grayscaleIcon')
  if (grayscaleIcon) setIconPaths('logo-gray')
}

async function setIcon(name: 'logo' | 'success') {
  const filename =
    name === 'logo' && (await getOption('grayscaleIcon')) // wrap
      ? 'logo-gray'
      : name

  return setIconPaths(filename)
}

function setIconPaths(filename: 'logo' | 'logo-gray' | 'success') {
  return chrome.action.setIcon({
    path: {
      16: `img/${filename}-16.png`,
      32: `img/${filename}-32.png`,
      48: `img/${filename}-48.png`,
      128: `img/${filename}-128.png`,
    },
  })
}
