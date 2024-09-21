import { getDummyWindow, getDummyTab } from '@/util/tabs'

type PreviewWindow = {
  tabs: PreviewTab[]
}

type PreviewTab = {
  title?: string
  url: string
  favIconUrl?: string
}

const previewWindows: PreviewWindow[] = [
  {
    tabs: [
      {
        title: 'Example 1',
        url: 'https://www.example.com/',
      },
      {
        title: 'Example 2',
        url: 'https://example.com/search?q=kittens',
      },
      {
        title: 'Example 3',
        url: 'http://example.com/folder/doc.html#fragment',
      },
    ],
  },
  {
    tabs: [
      {
        title: 'Tab Copy',
        url: 'https://tabcopy.com/',
        favIconUrl: 'https://tabcopy.com/favicon.ico',
      },
      {
        title: 'Session Buddy',
        url: 'https://sessionbuddy.com/',
        favIconUrl: 'https://sessionbuddy.com/wp-content/uploads/2024/03/logo-128-60x60.png',
      },
    ],
  },
]

export function getPreviewWindows() {
  return previewWindows.map(({ tabs }, wi) =>
    getDummyWindow({
      id: wi + 1,
      tabs: tabs.map(({ title, url, favIconUrl }, ti) =>
        getDummyTab({
          id: ti + 1,
          title,
          url,
          favIconUrl,
          index: ti,
          windowId: wi + 1,
          active: !ti,
        }),
      ),
    }),
  )
}
