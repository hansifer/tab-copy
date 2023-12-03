const { os } = await chrome.runtime.getPlatformInfo()

export const clientInfo = {
  os,
}
