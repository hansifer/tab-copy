import { getOptionValue, Options, OptionId } from '@/options'
import {
  formatIds,
  formatOpts,
  formatHasOpts,
  MIN_SELECTABLE_FORMAT_COUNT,
  FormatId,
} from '@/formats'

const storage = chrome.storage.local

// ----- primary format id -----

export async function getPrimaryFormatId() {
  const { primaryFormatId } = (await storage.get('primaryFormatId')) as {
    primaryFormatId: FormatId
  }

  const selectableFormatIds = await getSelectableFormatIds()

  if (!primaryFormatId || !selectableFormatIds.includes(primaryFormatId)) {
    // if primary format is not set or not selectable, determine and lock in a new one
    const primaryFormatId = selectableFormatIds[0]
    await storage.set({ primaryFormatId })
    return primaryFormatId
  }

  return primaryFormatId
}

export async function setPrimaryFormatId(id: FormatId) {
  const selectableFormatIds = await getSelectableFormatIds()

  if (selectableFormatIds.includes(id)) {
    // only allow set if format is selectable
    return storage.set({ primaryFormatId: id })
  }
}

// ----- ordered format ids -----

// returns comprehensive list of format ids, ordered by user preference
export async function getOrderedFormatIds() {
  const { orderedFormatIds = formatIds } = (await storage.get('orderedFormatIds')) as {
    orderedFormatIds: FormatId[]
  }

  return [
    ...orderedFormatIds,
    ...formatIds.filter((formatId) => !orderedFormatIds.includes(formatId)), // append any new formats
  ]
}

// ids should be comprehensive
export function setOrderedFormatIds(ids: FormatId[]) {
  return storage.set({ orderedFormatIds: ids })
}

// ----- selectable format ids -----

// results are ordered
export async function getSelectableFormatIds() {
  const unselectableFormatIds = await getUnselectableFormatIds()
  const orderedFormatIds = await getOrderedFormatIds()

  return orderedFormatIds.filter((formatId) => !unselectableFormatIds.includes(formatId))
}

export async function toggleSelectableFormatId(id: FormatId) {
  const unselectableFormatIds = await getUnselectableFormatIds()

  const makingUnselectable = !unselectableFormatIds.includes(id)

  // todo: adjust for presence of custom formats
  const selectableFormatCount = formatIds.length - unselectableFormatIds.length

  if (makingUnselectable && selectableFormatCount <= MIN_SELECTABLE_FORMAT_COUNT) {
    // do not allow unselecting beyond minimum selectable count
    return
  }

  return storage.set({
    unselectableFormatIds: makingUnselectable
      ? [...unselectableFormatIds, id]
      : unselectableFormatIds.filter((formatId) => formatId !== id),
  })
}

async function getUnselectableFormatIds() {
  const { unselectableFormatIds = [] } = (await storage.get('unselectableFormatIds')) as {
    unselectableFormatIds: FormatId[]
  }

  return unselectableFormatIds
}

// ----- format options -----

// generic is necessary to get correct opts return type for specific id
export async function getFormatOpts<T extends FormatId>(id: T) {
  if (formatHasOpts(id)) {
    const key = `${id}Opts`

    const { [key]: opts = formatOpts[id] } = (await storage.get(key)) as {
      [k: string]: (typeof formatOpts)[typeof id] // todo: possible to type the property key more specifically?
    }

    return opts
  }

  return null
}

// todo: setFormatOpts()

// ----- copied timestamp/trigger -----

export function setCopied() {
  return storage.set({ copied: performance.now() })
}

// ----- options -----

// generic is necessary to get specific return type for given id
export async function getOption<T extends OptionId>(id: T) {
  const storedOptions = await getOptions()
  return getOptionValue(id, storedOptions)
}

export async function setOption<T extends OptionId>(id: T, value: Options[T]) {
  const storedOptions = await getOptions()

  return storage.set({
    options: {
      ...storedOptions,
      [id]: value,
    },
  })
}

async function getOptions(): Promise<Partial<Options>> {
  const { options } = await storage.get('options')
  return options ?? {}
}

// ----- handle changes -----

type StorageChangeHandler = Parameters<typeof chrome.storage.onChanged.addListener>[0]
type StorageChanges = { [key: string]: chrome.storage.StorageChange }

export function makeStorageChangeHandler(
  callback: (changes: StorageChanges) => void,
): StorageChangeHandler {
  return (changes, areaName) => {
    if (areaName === 'local') {
      // console.log('storage changed', changes)
      callback(changes)
    }
  }
}
