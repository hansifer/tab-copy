import { FormatWithOptsId, FormatOpts } from '@/format'

export type ContentProps<T extends FormatWithOptsId> = {
  option: FormatOpts[T]
  onChange: (option: FormatOpts[T]) => void
  onConfirmDelete?: () => void
  onValidChanged?: (valid: boolean) => void
}
