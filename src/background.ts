import { copy } from '@/copy'
import { ScopeId } from '@/scope'
import { getOption } from '@/options'
import {
  // wrap
  getDefaultFormatId,
  makeStorageChangeHandler,
  updateCopyStats,
  getV3MigrationStatus,
  setV3MigrationStatus,
  CopyStatus,
  CopyType,
} from '@/storage'
import { getConfiguredFormat } from '@/configured-format'
import { offscreenActions } from '@/offscreen-actions'
import { migrateV3Data } from '@/v3-migration'
import { notification } from '@/util/notification'
import { sentenceCase } from '@/util/string'
import { serializer } from '@/util/async'
import { log } from '@/util/log'
import { intl } from '@/intl'

import { refreshMenus, handleMenuAction } from './copy-menus'

let prefersColorSchemeDarkCache: boolean | null = null

const copyNotification = notification('copy')

let actionIconFlashTimer: ReturnType<typeof setTimeout>

const commandNameScopeId: Record<string, ScopeId> = {
  '1copy-highlighted-tabs': 'highlighted-tabs',
  '2copy-window-tabs': 'window-tabs',
  '3copy-all-tabs': 'all-tabs',
  '4copy-all-windows-and-tabs': 'all-windows-and-tabs',
} as const

log(`service worker loaded ${new Date().toLocaleString()}`)

// ensure refreshMenus() calls don't overlap
const enqueue = serializer()

chrome.runtime.onInstalled.addListener(
  async ({ reason, previousVersion }: chrome.runtime.InstalledDetails) => {
    if (reason === 'install') {
      // todo: create install notification
      log('extension installed')
    } else if (reason === 'update') {
      // fired for unpacked extension reload, so check for ver change
      const currentVersion = chrome.runtime.getManifest().version

      if (previousVersion !== currentVersion) {
        log(`extension updated ${previousVersion} -> ${currentVersion}`)

        if (previousVersion?.startsWith('3.')) {
          chrome.tabs.create({
            url: chrome.runtime.getURL('release-notification.html'),
          })

          const migrationStatus = await getV3MigrationStatus()

          if (!migrationStatus?.success) {
            try {
              const v3Data = await offscreenActions.getV3Data()

              if (!v3Data) {
                throw new Error('failed to acquire v3 data')
              }

              await migrateV3Data(v3Data)

              setV3MigrationStatus({ success: true })
            } catch (ex: any) {
              console.error('failed to fully migrate v3 data.', ex)

              setV3MigrationStatus({
                success: false,
                message: `${ex?.message || ex || 'failed to fully migrate v3 data'}`,
              })
            }
          }
        }
      } else {
        log('extension reloaded')
      }
    } else if (
      reason === 'chrome_update' ||
      (reason as string) === 'browser_update' // polyfill or other browser apis may provide "browser_update" instead of "chrome_update"
    ) {
      log('browser version updated')
    }

    enqueue(refreshMenus)
  },
)

// fires on leaf nodes and branch nodes with empty `items`
chrome.contextMenus.onClicked.addListener(handleMenuAction)

setIcon('logo')

chrome.runtime.onStartup.addListener(() => {
  setIcon('logo')
})

chrome.commands.onCommand.addListener(async (commandName) => {
  const scopeId = commandNameScopeId[commandName]

  if (!scopeId) {
    console.warn(`no scope found for command ${commandName}`)
    return
  }

  const format = await getConfiguredFormat(await getDefaultFormatId())

  try {
    await copy({
      scopeId,
      format,
      useLegacyClipboardWrite: true, // use offscreen action because extension service workers do not have direct access to the Clipboard API
    })
  } catch (ex) {
    console.error('failed to copy to clipboard.', ex)
  }
})

chrome.storage.onChanged.addListener(
  makeStorageChangeHandler((changes) => {
    // listening for `copyStatus` storage event instead of using `chrome.runtime` messaging because popup `window.close()` interrupts the message
    if (changes.copyStatus?.newValue) {
      clearTimeout(actionIconFlashTimer)

      const { status, type, count, formatId } = changes.copyStatus.newValue as CopyStatus

      const success = status === 'success'

      // --- flash extension icon ---

      setIcon(success ? 'success' : 'fail')

      actionIconFlashTimer = setTimeout(() => {
        setIcon('logo')
      }, 1e3)

      // --- notify ---

      getOption('notifyOnCopy').then(async ({ value: notify }) => {
        if (notify) {
          try {
            const typeLabel = getCopyTypeLabel(type)

            copyNotification.notify(
              success
                ? {
                    iconUrl: 'img/success-128.png',
                    title: sentenceCase(
                      intl.copySuccess({
                        count,
                        typeLabel,
                      }),
                    ),
                    message: sentenceCase(
                      intl.copySuccess({
                        count,
                        typeLabel,
                        formatLabel: (await getConfiguredFormat(formatId)).label,
                      }),
                    ),
                  }
                : {
                    iconUrl: 'img/fail-128.png',
                    message: sentenceCase(intl.copyFail()),
                  },
            )
          } catch (ex) {
            console.error('notification error', ex)
          }
        }
      })

      // --- log ---

      if (success) {
        log(`${count ? `${count} ` : ''}${count === 1 ? type : `${type}s`} copied as ${formatId}`)
        updateCopyStats({ type, count, formatId })
      } else {
        console.warn(`failed to copy type ${type} as ${formatId}`)
        // todo: log failure to DB
      }
    }

    if (changes.options) {
      setIcon('logo')
    }
  }),
)

const optionAndFormatChanges = [
  'options',
  'customFormatIds',
  'orderedFormatIds',
  'hiddenFormatIds',
  'formatOpts',
]

chrome.storage.onChanged.addListener(
  makeStorageChangeHandler(
    () => {
      enqueue(refreshMenus)
    },
    {
      listen: optionAndFormatChanges,
      throttle: 1_000, // use debounce instead (once supported)
    },
  ),
)

async function setIcon(name: 'logo' | 'success' | 'fail') {
  const filename =
    name === 'fail' // wrap
      ? 'fail'
      : name === 'success'
        ? 'success'
        : await getLogoIconFilename()

  return chrome.action.setIcon({
    path: {
      16: `img/${filename}-16.png`,
      32: `img/${filename}-32.png`,
      48: `img/${filename}-48.png`,
      128: `img/${filename}-128.png`,
    },
  })
}

async function getLogoIconFilename() {
  // limitation: dark mode detection works fine in most cases except when the user has explicitly selected "Light" or "Dark" in Chrome `Settings > Appearance` and the system theme is the opposite of what was selected. we can only programmatically query the system theme.
  const darkMode = await getPrefersColorSchemeDark()
  const invertIcon = (await getOption('invertIcon')).value

  return (darkMode && !invertIcon) || (!darkMode && invertIcon)
    ? 'logo-outline-white'
    : 'logo-outline-black'
}

async function getPrefersColorSchemeDark() {
  if (prefersColorSchemeDarkCache === null) {
    try {
      prefersColorSchemeDarkCache = await offscreenActions.prefersColorSchemeDark()
    } catch (ex) {
      console.error('failed to get theme preference (error sending offscreen action).', ex)
    }
  }

  return prefersColorSchemeDarkCache ?? false
}

function getCopyTypeLabel(type: CopyType): (count?: number) => string {
  switch (type) {
    case 'tab':
      return intl.tab

    case 'window':
      return intl.window

    case 'link':
      return intl.link

    case 'image':
      return intl.image

    case 'video':
      return intl.video

    case 'audio':
      return intl.audio

    default:
      return intl.unknown
  }
}
