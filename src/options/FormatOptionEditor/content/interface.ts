import { FormatWithOptionId, FormatOptions } from '@/format'

export type ContentProps<T extends FormatWithOptionId> = {
  option: FormatOptions[T]
  onChange: (option: FormatOptions[T]) => void
  onConfirmDelete?: () => void
  onValidChanged?: (valid: boolean) => void
}
