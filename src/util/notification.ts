// auto-gen notificationId if not provided
let idIncrement: number = 1

// duration has a limit set by the OS. we only have control over durations shorter than this limit.
type NotificationOpts = chrome.notifications.NotificationOptions<false> & { duration?: number }

export function notification(notificationId?: string, globalOpts?: NotificationOpts) {
  const id = notificationId || `notification-${idIncrement++}`

  // control duration
  let timeout: NodeJS.Timeout

  const api = {
    async notify(opts?: NotificationOpts) {
      const mergedOpts: NotificationOpts = { ...globalOpts, ...opts }

      if (!mergedOpts.iconUrl) {
        throw new Error('notification requires iconUrl')
      }

      if (!(await hasPermission())) {
        throw new Error('cannot create notification. notification permission required.')
      }

      await api.clear()

      await createNotification(id, {
        ...mergedOpts,

        // required for create:
        iconUrl: mergedOpts.iconUrl!, // TS needs help here
        contextMessage: mergedOpts.title || '',
        title: '',
        message: mergedOpts.message || '',
        type: mergedOpts.type || 'basic',
      })

      timeout = setTimeout(() => {
        api.clear()
      }, mergedOpts.duration || 2_000)
    },

    async clear() {
      clearTimeout(timeout)

      if (!(await hasPermission())) {
        throw new Error('cannot clear notification. notification permission required.')
      }

      return clearNotification(id)
    },
  }

  return api
}

// provide promise-based notifications functions since `@types/chrome` seems to be missing these

function hasPermission() {
  return new Promise<boolean>((resolve) => {
    chrome.permissions.contains({ permissions: ['notifications'] }, (granted) => {
      if (!granted) {
        return resolve(false)
      }

      chrome.notifications.getPermissionLevel((level) => {
        resolve(level === 'granted')
      })
    })
  })
}

function clearNotification(id: string) {
  return new Promise<boolean>((resolve) => {
    chrome.notifications.clear(id, (cleared) => {
      resolve(cleared)
    })
  })
}

function createNotification(id: string, opts: chrome.notifications.NotificationOptions<true>) {
  return new Promise<string>((resolve) => {
    chrome.notifications.create(id, opts, (id) => {
      resolve(id)
    })
  })
}
