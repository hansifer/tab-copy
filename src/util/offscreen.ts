const creating = new Map<string, Promise<void>>() // avoid concurrency issues

// create a singleton offline doc
export async function setupOffscreenDocument({
  url,
  reasons,
  justification,
}: chrome.offscreen.CreateParameters) {
  const docExists = !!(
    await chrome.runtime.getContexts({
      contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
      documentUrls: [chrome.runtime.getURL(url)],
    })
  ).length

  if (docExists) return

  if (creating.has(url)) {
    await creating.get(url)
  } else {
    const promise = chrome.offscreen.createDocument({
      url,
      reasons,
      justification,
    })

    creating.set(url, promise)

    await promise

    creating.delete(url)
  }
}
