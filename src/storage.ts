import { selectOption, Options, OptionId } from '@/options'
import {
  builtInFormatIds,
  MIN_SELECTABLE_FORMAT_COUNT,
  isCustomFormatId,
  selectFormatOption,
  FormatId,
  BuiltInFormatWithOptionId,
  CustomFormatId,
  FormatOptions,
} from '@/format'
import { newId } from '@/util/id'

const storage = chrome.storage.local

// ----- options -----

// generic is necessary to get specific return type for given id
export async function getOption<T extends OptionId>(id: T) {
  const allOptions = await getAllOptions()
  return selectOption(id, allOptions)
}

export async function setOption<T extends OptionId>(id: T, value: Options[T]) {
  const allOptions = await getAllOptions()

  return storage.set({
    options: {
      ...allOptions,
      [id]: value,
    },
  })
}

async function getAllOptions(): Promise<Partial<Options>> {
  const { options } = await storage.get('options')
  return options ?? {}
}

// ----- primary format id -----

export async function getPrimaryFormatId() {
  const { primaryFormatId } = (await storage.get('primaryFormatId')) as {
    primaryFormatId: FormatId
  }

  const selectableFormatIds = await getSelectableFormatIds()

  if (!primaryFormatId || !selectableFormatIds.includes(primaryFormatId)) {
    // if primary format is not set or not selectable, find and lock in a new one
    const primaryFormatId = selectableFormatIds[0]
    await storage.set({ primaryFormatId })
    return primaryFormatId
  }

  return primaryFormatId
}

export async function setPrimaryFormatId(id: FormatId) {
  if (await isSelectable(id)) {
    return storage.set({ primaryFormatId: id })
  }
}

// ----- custom format ids -----

export async function addCustomFormat() {
  const id = makeCustomFormatId()

  // place at top of format order
  const orderedFormatIds = await getOrderedFormatIds()
  await setOrderedFormatIds([id, ...orderedFormatIds])

  await addCustomFormatId(id)

  return id
}

export async function removeCustomFormat(id: CustomFormatId) {
  // enforce minimum selectable count
  if ((await isSelectable(id)) && (await hasMinimumSelectableFormatCount())) return

  await removeCustomFormatId(id)

  // cleanup

  await removeOrderedFormatId(id)

  await toggleSelectableFormatId(id, true)

  return removeFormatOption(id)
}

async function addCustomFormatId(id: CustomFormatId) {
  const customFormatIds = await getCustomFormatIds()

  if (isCustomFormatId(id) && !customFormatIds.includes(id)) {
    return setCustomFormatIds([...customFormatIds, id])
  }
}

async function removeCustomFormatId(id: CustomFormatId) {
  const customFormatIds = await getCustomFormatIds()

  if (customFormatIds.includes(id)) {
    return setCustomFormatIds(customFormatIds.filter((formatId) => formatId !== id))
  }
}

async function getCustomFormatIds(): Promise<CustomFormatId[]> {
  const { customFormatIds = [] } = await storage.get('customFormatIds')
  return customFormatIds
}

function setCustomFormatIds(ids: CustomFormatId[]) {
  return storage.set({ customFormatIds: ids })
}

function makeCustomFormatId(): CustomFormatId {
  return `custom-${newId()}`
}

// ----- ordered format ids -----

// returns comprehensive list of legit format ids, ordered by user preference
export async function getAllFormatIds() {
  const orderedFormatIds = await getOrderedFormatIds() // may be incomplete
  const legitFormatIds = await getLegitFormatIds()

  // remove stale ids
  const legitOrderedFormatIds = orderedFormatIds.filter((id) => legitFormatIds.includes(id))

  // backfill missing ids
  const missingFormatIds = legitFormatIds.filter((id) => !legitOrderedFormatIds.includes(id))

  return [...legitOrderedFormatIds, ...missingFormatIds]
}

export function setOrderedFormatIds(ids: FormatId[]) {
  return storage.set({ orderedFormatIds: ids })
}

async function removeOrderedFormatId(id: FormatId) {
  const orderedFormatIds = await getOrderedFormatIds()

  if (orderedFormatIds.includes(id)) {
    return setOrderedFormatIds(orderedFormatIds.filter((formatId) => formatId !== id))
  }
}

async function getLegitFormatIds(): Promise<FormatId[]> {
  const customFormatIds = await getCustomFormatIds()
  return [...builtInFormatIds, ...customFormatIds]
}

async function getOrderedFormatIds(): Promise<FormatId[]> {
  const { orderedFormatIds = [] } = await storage.get('orderedFormatIds')
  return orderedFormatIds
}

// ----- selectable format ids -----

// results are ordered
export async function getSelectableFormatIds() {
  const allFormatIds = await getAllFormatIds()
  const unselectableFormatIds = await getUnselectableFormatIds()

  return allFormatIds.filter((id) => !unselectableFormatIds.includes(id))
}

export async function toggleSelectableFormatId(id: FormatId, selectable?: boolean) {
  const unselectableFormatIds = await getUnselectableFormatIds()

  const isSelectable = !unselectableFormatIds.includes(id)
  const makingSelectable = selectable === undefined ? !isSelectable : selectable

  if (isSelectable && !makingSelectable) {
    // do not allow unselecting beyond minimum selectable count
    if (await hasMinimumSelectableFormatCount()) return

    return setUnselectableFormatIds([...unselectableFormatIds, id])
  }

  if (!isSelectable && makingSelectable) {
    return setUnselectableFormatIds(unselectableFormatIds.filter((formatId) => formatId !== id))
  }
}

async function isSelectable(id: FormatId) {
  const selectableFormatIds = await getSelectableFormatIds()
  return selectableFormatIds.includes(id)
}

async function hasMinimumSelectableFormatCount() {
  const selectableFormatIds = await getSelectableFormatIds()
  return selectableFormatIds.length <= MIN_SELECTABLE_FORMAT_COUNT
}

async function getUnselectableFormatIds(): Promise<FormatId[]> {
  const { unselectableFormatIds = [] } = await storage.get('unselectableFormatIds')
  return unselectableFormatIds
}

function setUnselectableFormatIds(ids: FormatId[]) {
  return storage.set({ unselectableFormatIds: ids })
}

// ----- format options -----

// generic is necessary to get specific return type for given id
export async function getFormatOption<T extends FormatId>(id: T) {
  const allFormatOptions = await getAllFormatOptions()
  return selectFormatOption(id, allFormatOptions)
}

// todo: validate id? (isBuiltInFormatWithOptionId(), isCustomFormatId(), isLegitFormatId())
export async function setFormatOption<T extends BuiltInFormatWithOptionId | CustomFormatId>(
  id: T,
  value: FormatOptions[T],
) {
  const allFormatOptions = await getAllFormatOptions()

  return storage.set({
    formatOptions: {
      ...allFormatOptions,
      [id]: value,
    },
  })
}

async function removeFormatOption(id: BuiltInFormatWithOptionId | CustomFormatId) {
  const allFormatOptions = await getAllFormatOptions()

  if (id in allFormatOptions) {
    const { [id]: _, ...rest } = allFormatOptions
    return storage.set({ formatOptions: rest })
  }
}

async function getAllFormatOptions(): Promise<Partial<FormatOptions>> {
  const { formatOptions } = await storage.get('formatOptions')
  return formatOptions ?? {}
}

// ----- copied timestamp/trigger -----

export function setCopied() {
  return storage.set({ copied: performance.now() })
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
