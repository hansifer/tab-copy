// this file contains an abridged nxs spec that includes:
// - subset of nxs.client items that are tracked / copied
// - subset of nxs.client and nxs.collection items in the local or cloud clipboard contents that are used for display or the Open feature

type UTC = Date | number

declare namespace nxs.client {
  export type Window = {
    id: number
    title?: string
    type?: chrome.windows.windowTypeEnum
    state?: chrome.windows.windowStateEnum
    incognito?: boolean
    top?: number
    left?: number
    width?: number
    height?: number
    created?: UTC
    updated?: UTC
    tabs: Tab[]
  }

  export type Tab = {
    id: number
    url: string
    pendingUrl?: string
    favIconUrl?: string
    favIcons?: nxs.common.FavIcon[] // from site metadata
    title?: string // original tab title provided by page OR rewritten value
    titleOriginal?: string // original tab title provided by page. present only if title was rewritten.
    description?: string // from site metadata
    groupId?: number // spec assumes uniqueness PER WINDOW
    active?: boolean
    pinned?: boolean
    created?: UTC
    updated?: UTC
    loaded?: UTC
  }
}

declare namespace nxs.collection {
  export type Folder = {
    id: string
    title?: string
    description?: string
    type?: chrome.windows.windowTypeEnum
    state?: chrome.windows.windowStateEnum
    incognito?: boolean
    top?: number
    left?: number
    width?: number
    height?: number
    created?: UTC
    updated?: UTC
    links: Link[]
  }

  export type Link = {
    id: string
    url: string
    favIconUrl?: string
    favIcons?: nxs.common.FavIcon[] // from site metadata or user overrides
    title?: string // original link title provided by page OR rewritten value OR user-customized value
    titleOriginal?: string // original link title provided by page. present only if title was rewritten or user-customized.
    description?: string // from site metadata
    userDescription?: string // description contributed by user
    groupId?: number // spec assumes uniqueness PER FOLDER
    active?: boolean
    pinned?: boolean
    created?: UTC
    updated?: UTC
  }
}

declare namespace nxs.content {
  export type Group = nxs.client.Window | nxs.collection.Folder
  export type Unit = nxs.client.Tab | nxs.collection.Link

  export type Item = Group | Unit

  // groups/units are never mixed
  export type Groups = nxs.client.Window[] | nxs.collection.Folder[]
  export type Units = nxs.client.Tab[] | nxs.collection.Link[]

  export type GroupUnit<G extends Group> = G extends nxs.client.Window
    ? nxs.client.Tab
    : nxs.collection.Link

  export type GroupUnits<G extends Group> = G extends nxs.client.Window
    ? nxs.client.Tab[]
    : nxs.collection.Link[]
}

declare namespace nxs.common {
  export type FavIcon = {
    url: string
    override?: boolean // only relevant for Link
    dark?: boolean
    width?: number
    height?: number
    size?: number // use instead of width and height if same
  }
}
