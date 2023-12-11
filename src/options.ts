import { intl } from '@/intl'
import { KeyOfType } from '@/util/typescript'

// --- 1. add new option below by way of declaring defaults ---

export const options = {
  confirmCopyWithPopup: false,
  ignorePinnedTabs: false,
  showInContextMenu: true,
  grayscaleIcon: false,
}

export type Options = typeof options
export type OptionId = keyof Options
export type BooleanOptionId = KeyOfType<Options, boolean>

// --- 2. add label for new option by creating an intl function with same name as option id ---

export function getOptionLabel(id: OptionId) {
  return intl[id]()
}

// select option value with default fallback
export function selectOption<T extends OptionId>(id: T, lookup?: Partial<Options>) {
  return lookup?.[id] ?? options[id]
}
