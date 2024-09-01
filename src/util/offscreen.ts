let creating: Promise<void> | null = null // avoid concurrency issues

export async function setupOffscreenDocument(path: string) {
  const docExists = !!(
    await chrome.runtime.getContexts({
      contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
      documentUrls: [chrome.runtime.getURL(path)],
    })
  ).length

  if (docExists) return

  if (creating) {
    await creating
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: 'Copy a tab or link to the clipboard from a context menu',
    })

    await creating

    creating = null
  }
}
