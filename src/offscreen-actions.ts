import { legacyClipboardWrite, Representations } from '@/util/clipboard'
import { getTextArea } from '@/util/dom'

// only a single offscreen document may be created at a time, regardless of url. this file includes logic for the use cases serviced by this app's singular offscreen document.
// - this module is used both by action consumers and the offscreen document itself. keeping this in mind, note that browser api's are unavailable at runtime in offscreen documents except for `chrome.runtime`.

// to service additional use cases:
// - add to `actions` object
// - if necessary, expand `chrome.offscreen.CreateParameters` `reasons` and edit `justification`

const RELATIVE_URL = 'offscreen.html'
const TARGET = 'offscreen'

// define action types and corresponding async handlers
// `data` must be serializable
const actions = {
  copyToClipboard: async (data: Representations) => {
    // using legacy clipboard write because `navigator.clipboard` requires the window to be focused (even when Clipboard perm is granted) and offscreen documents cannot be focused
    legacyClipboardWrite(data, getTextArea('clipboard'))
  },
} as const satisfies Record<string, (data: any) => Promise<any>>

type ActionType = keyof typeof actions

type ActionData<T extends ActionType> = (typeof actions)[T] extends (data: infer U) => Promise<any>
  ? U
  : never

type OffscreenMessage<T extends ActionType = ActionType> = T extends ActionType
  ? {
      type: T
      data: ActionData<T>
    }
  : never

type TargetedOffscreenMessage = OffscreenMessage & {
  target: typeof TARGET
}

// provide methods to initiate offscreen actions
export const offscreenActions = Object.fromEntries(
  (Object.keys(actions) as ActionType[]).map(<T extends ActionType>(type: T) => [
    type,
    (data: ActionData<T>) => sendOffscreenMessage({ type, data } as OffscreenMessage<T>),
  ]),
) as {
  [k in ActionType]: (data: ActionData<k>) => Promise<any>
}

// --- messaging ---

// used by offscreen document
export function listenForOffscreenMessage() {
  chrome.runtime.onMessage.addListener(
    ({ type, data, target }: TargetedOffscreenMessage, _, sendResponse) => {
      if (target === TARGET) {
        // https://stackoverflow.com/a/76189736
        actions[type](data as any)
          .then((response) => {
            sendResponse(response)
          })
          .catch((ex) => {
            console.error(`offscreen action ${type} failed`, ex)
            sendResponse()
          })
          .finally(() => {
            window.close()
          })

        return true // signal to sender that response will be sent asynchronously
      }
    },
  )
}

async function sendOffscreenMessage(message: OffscreenMessage) {
  await setupOffscreenDocument()

  const response = await chrome.runtime.sendMessage({
    ...message,
    target: TARGET,
  })

  return response
}

let creatingOffscreenDoc: Promise<void> | null = null // avoid concurrency issues

// avoid error "Only a single offscreen document may be created"
async function setupOffscreenDocument() {
  const docExists = !!(
    await chrome.runtime.getContexts({
      contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
      documentUrls: [chrome.runtime.getURL(RELATIVE_URL)],
    })
  ).length

  if (docExists) return

  if (creatingOffscreenDoc) {
    await creatingOffscreenDoc
  } else {
    creatingOffscreenDoc = chrome.offscreen.createDocument({
      url: RELATIVE_URL,
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: 'Copy a tab or link to the clipboard from a context menu',
    })

    await creatingOffscreenDoc

    creatingOffscreenDoc = null
  }
}
