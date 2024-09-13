// slightly-opinionated utility for managing top-level browser extension context menus with arbitrarily-nested submenus
// - menu structure is specified as an object hierarchy
// - is agnostic to menu item click handling. consumer must call `chrome.contextMenus.onClicked.addListener()` and map menu item ids to actions in the handler.

// do not allow 'browser_action', 'page_action', 'action' menus
const allContexts = [
  'page',
  'frame',
  'selection',
  'link',
  'editable',
  'image',
  'video',
  'audio',
] as const satisfies chrome.contextMenus.ContextType[]

export type Context = (typeof allContexts)[number]

type MenuNodeBase = {
  title: string
  contexts?: Context[]
}

// top-level menu item receives id from `contextMenu()`
export type MenuStructure = MenuNodeBase & {
  items?: MenuNode[]
}

export type MenuNode = MenuNodeBase &
  (
    | {
        // branch; id auto-generated
        items: MenuNode[]
      }
    | {
        // leaf
        id: string // id required to map action in onClicked handler
      }
  )

// generate unique ids for branch nodes. these can be dynamic since we don't reference them and only include them to satisfy chrome api's requirement.
let idIncrement: number = 1

// instantiates a controller for a top-level menu with optional submenus
export function contextMenu(id: string) {
  const api = {
    async refresh(structure: MenuStructure) {
      await api.remove()

      return create({
        node: { ...structure, id },
      })
    },

    remove() {
      return removeContextMenu(id)
    },
  }

  return api

  async function create({
    // wrap
    node,
    parentId,
  }: {
    node: MenuNode
    parentId?: string
  }) {
    const id = ('id' in node && node.id) || `${idIncrement++}`

    await createContextMenu({
      id,
      ...(parentId ? { parentId } : null), // firefox doesn't allow setting undefined parentId
      title: node.title,
      contexts: node.contexts || allContexts,
    })

    if ('items' in node) {
      for (const childNode of node.items) {
        await create({
          node: childNode,
          parentId: id,
        })
      }
    }
  }
}

// provide promise-based contextMenus functions since `@types/chrome` seems to be missing these

function createContextMenu(createProperties: chrome.contextMenus.CreateProperties) {
  return new Promise<void>((resolve, reject) => {
    chrome.contextMenus.create(createProperties, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}

function removeContextMenu(id: string | number) {
  return new Promise<void>((resolve) => {
    chrome.contextMenus.remove(id, () => {
      resolve()

      // swallow errors since contextMenus api does not have a way to check if a menu exists before attempting to remove it. this is fine since remove is expected to fail only if the menu does not exist. separate menu tracking would require storage and be overkill for this.
      void chrome.runtime.lastError // show chrome that we checked the error
    })
  })
}
