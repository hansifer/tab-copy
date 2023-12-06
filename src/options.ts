import { intl } from '@/intl'
import { KeyOfType } from '@/util/typescript'

// --- 1. add new options below by way of declaring defaults ---

export const options = {
  confirmCopyWithPopup: false,
  ignorePinnedTabs: false,
  showInContextMenu: true,
  grayscaleIcon: false,
}

export type OptionId = keyof typeof options
export type BooleanOptionId = KeyOfType<typeof options, boolean>

// --- 2. add label for new option by creating an intl function with same name as the option id ---

export function getOptionLabel(id: OptionId) {
  return intl[id]()
}
