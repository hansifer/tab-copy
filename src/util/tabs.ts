// todo: filter per "Ignore pinned tabs" option
export async function getTabs() {
  const wins = await chrome.windows.getAll({ populate: true })
  const currentWinId = (await chrome.windows.getCurrent()).id

  const all = wins.flatMap(({ tabs }) => tabs).filter((tab): tab is chrome.tabs.Tab => !!tab)
  const inCurrentWin = all.filter(({ windowId }) => windowId === currentWinId)
  const highlighted = inCurrentWin.filter(({ highlighted }) => !!highlighted)

  return {
    highlighted,
    inCurrentWin,
    all,
  }
}
