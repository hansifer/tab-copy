import { FormatWithOptsId, FormatOpts } from '@/format'

export type ContentProps<T extends FormatWithOptsId> = {
  opts: FormatOpts[T]
  onChange: (opts: FormatOpts[T]) => void
  onConfirmDelete?: () => void
  onValidChanged?: (valid: boolean) => void
}
