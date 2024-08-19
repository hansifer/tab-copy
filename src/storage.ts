import throttle from 'lodash.throttle'

import { OptionId, OptionValue } from '@/options'
import { OptionTipId } from '@/option-tips'
import { scopes, MIN_VISIBLE_SCOPE_COUNT, ScopeId } from '@/scope'
import {
  builtinFormatIds,
  MIN_VISIBLE_FORMAT_COUNT,
  isCustomFormatId,
  FormatId,
  FormatWithOptsId,
  CustomFormatId,
  FormatOpts,
} from '@/format'
import { newId } from '@/util/id'

class MinVisibleScopeExceededError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MinVisibleScopeExceededError'
  }
}

export class MinVisibleFormatExceededError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MinVisibleFormatExceededError'
  }
}

const storage = chrome.storage.local

// ----- options -----

// generic is necessary to get specific return type for given id
export async function getOptionValue<T extends OptionId>(id: T) {
  const allOptionValues = await getAllOptionValues()
  return allOptionValues[id]
}

export async function setOptionValue<T extends OptionId>(id: T, value: OptionValue<T>) {
  const allOptionValues = await getAllOptionValues()

  return storage.set({
    options: {
      ...allOptionValues,
      [id]: value,
    },
  })
}

async function getAllOptionValues(): Promise<{
  [P in OptionId]?: OptionValue<P>
}> {
  const { options } = await storage.get('options')
  return options ?? {}
}

// ----- option tips -----

export async function hideOptionTip(id: OptionTipId) {
  const hiddenOptionTipIds = await getHiddenOptionTipIds()

  if (!hiddenOptionTipIds.includes(id)) {
    await storage.set({
      hiddenOptionTips: [...hiddenOptionTipIds, id],
    })
  }
}

export async function getHiddenOptionTipIds(): Promise<OptionTipId[]> {
  const { hiddenOptionTips } = await storage.get('hiddenOptionTips')
  return hiddenOptionTips ?? []
}

// ----- scopes -----

export async function getVisibleScopes() {
  const hiddenScopeIds = await getHiddenScopeIds()
  return scopes.filter(({ id }) => !hiddenScopeIds.includes(id))
}

export async function toggleVisibleScopeId(id: ScopeId, visible?: boolean) {
  const hiddenScopeIds = await getHiddenScopeIds()

  const isVisible = !hiddenScopeIds.includes(id)
  const makingVisible = visible === undefined ? !isVisible : visible

  if (isVisible && !makingVisible) {
    // do not allow unselecting beyond minimum visible count
    if (await hasMinimumVisibleScopeCount()) {
      throw new MinVisibleScopeExceededError(
        `Scope ${id} cannot be hidden because at least ${MIN_VISIBLE_SCOPE_COUNT} ${
          MIN_VISIBLE_SCOPE_COUNT === 1 ? 'scope' : 'scopes'
        } must be visible.`,
      )
    }

    return setHiddenScopeIds([...hiddenScopeIds, id])
  }

  if (!isVisible && makingVisible) {
    return setHiddenScopeIds(hiddenScopeIds.filter((scopeId) => scopeId !== id))
  }
}

async function hasMinimumVisibleScopeCount() {
  const visibleScopes = await getVisibleScopes()
  return visibleScopes.length <= MIN_VISIBLE_SCOPE_COUNT
}

async function getHiddenScopeIds(): Promise<ScopeId[]> {
  const { hiddenScopeIds = <ScopeId[]>['all-windows-and-tabs'] } =
    await storage.get('hiddenScopeIds')

  return hiddenScopeIds
}

function setHiddenScopeIds(ids: ScopeId[]) {
  return storage.set({ hiddenScopeIds: ids })
}

// ----- default format id -----

export async function getDefaultFormatId() {
  const visibleFormatIds = await getVisibleFormatIds()
  return visibleFormatIds[0]
}

export async function setDefaultFormat(id: FormatId) {
  if (await isVisibleFormat(id)) {
    // move to top of format order
    const orderedFormatIds = await getOrderedFormatIds()
    await setOrderedFormatIds([id, ...orderedFormatIds.filter((formatId) => formatId !== id)])
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
  // enforce minimum visible count
  if ((await isVisibleFormat(id)) && (await hasMinimumVisibleFormatCount())) {
    throw new MinVisibleFormatExceededError(
      `Format ${id} cannot be deleted because it is one of only ${MIN_VISIBLE_FORMAT_COUNT} visible formats.`,
    )
  }

  await removeCustomFormatId(id)

  // cleanup

  await removeOrderedFormatId(id)

  await toggleVisibleFormatId(id, true)

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
  return [...builtinFormatIds, ...customFormatIds]
}

async function getOrderedFormatIds(): Promise<FormatId[]> {
  const { orderedFormatIds = [] } = await storage.get('orderedFormatIds')
  return orderedFormatIds
}

// ----- visible format ids -----

// results are ordered
export async function getVisibleFormatIds() {
  const allFormatIds = await getAllFormatIds()
  const hiddenFormatIds = await getHiddenFormatIds()

  return allFormatIds.filter((id) => !hiddenFormatIds.includes(id))
}

export async function toggleVisibleFormatId(id: FormatId, visible?: boolean) {
  const hiddenFormatIds = await getHiddenFormatIds()

  const isVisible = !hiddenFormatIds.includes(id)
  const makingVisible = visible === undefined ? !isVisible : visible

  if (isVisible && !makingVisible) {
    // do not allow unselecting beyond minimum visible count
    if (await hasMinimumVisibleFormatCount()) {
      throw new MinVisibleFormatExceededError(
        `Format ${id} cannot be hidden because it is one of only ${MIN_VISIBLE_FORMAT_COUNT} visible formats.`,
      )
    }

    return setHiddenFormatIds([...hiddenFormatIds, id])
  }

  if (!isVisible && makingVisible) {
    return setHiddenFormatIds(hiddenFormatIds.filter((formatId) => formatId !== id))
  }
}

async function isVisibleFormat(id: FormatId) {
  const visibleFormatIds = await getVisibleFormatIds()
  return visibleFormatIds.includes(id)
}

async function hasMinimumVisibleFormatCount() {
  const visibleFormatIds = await getVisibleFormatIds()
  return visibleFormatIds.length <= MIN_VISIBLE_FORMAT_COUNT
}

async function getHiddenFormatIds(): Promise<FormatId[]> {
  const { hiddenFormatIds = [] } = await storage.get('hiddenFormatIds')
  return hiddenFormatIds
}

function setHiddenFormatIds(ids: FormatId[]) {
  return storage.set({ hiddenFormatIds: ids })
}

// ----- format opts -----

// generic is necessary to get specific return type for given id
export async function getFormatOption<T extends FormatId>(id: T) {
  const allFormatOpts = await getAllFormatOptions()
  return allFormatOpts[id]
}

// todo: validate id? (isBuiltinFormatWithOptionId(), isCustomFormatId(), isLegitFormatId())
export async function setFormatOption<T extends FormatWithOptsId>(id: T, value: FormatOpts[T]) {
  const allFormatOpts = await getAllFormatOptions()

  return storage.set({
    formatOptions: {
      ...allFormatOpts,
      [id]: value,
    },
  })
}

async function removeFormatOption(id: FormatWithOptsId) {
  const allFormatOpts = await getAllFormatOptions()

  if (id in allFormatOpts) {
    const { [id]: _, ...rest } = allFormatOpts
    return storage.set({ formatOptions: rest })
  }
}

async function getAllFormatOptions(): Promise<Partial<FormatOpts>> {
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
  { throttle: throttleTime = 0, listen }: { throttle?: number; listen?: string[] } = {},
): StorageChangeHandler {
  const fct = throttleTime // wrap
    ? throttle(callback, throttleTime, { leading: true, trailing: true })
    : callback

  return (changes, areaName) => {
    if (areaName === 'local') {
      if (!listen || listen.some((change) => change in changes)) {
        // console.log('storage changed', changes)
        fct(changes)
      }
    }
  }
}
