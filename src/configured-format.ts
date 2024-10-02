import {
  getFormat,
  isFormatWithOptsId,
  FormatId,
  FormatOpts,
  FormatWithOpts,
  Transforms,
} from '@/format'
import {
  // wrap
  getVisibleFormatIds,
  getAllFormatIds,
  getFormatOpts,
} from '@/storage'

export type ConfiguredFormat<T extends FormatId = FormatId> = {
  id: T
  label: string
  description?: string
  visible: boolean
  isDefault: boolean // `default` is a JS reserved keyword; todo: consider removing this field and instead having implementation infer default format from visibleFormats[0] (currently only 1 instance (in popup.ts) would need to be updated)
  transforms: Transforms
  opts: FormatOpts[T]
  isInvalid?: (opts: Record<string, any>) => boolean
}

export async function getConfiguredFormat<T extends FormatId>(id: T) {
  const visibleFormatIds = await getVisibleFormatIds()

  return makeConfiguredFormat(id, visibleFormatIds)
}

export async function getConfiguredFormats({ visibleOnly }: { visibleOnly?: boolean } = {}) {
  const visibleFormatIds = await getVisibleFormatIds()

  const formatIds = visibleOnly // wrap
    ? visibleFormatIds
    : await getAllFormatIds()

  return Promise.all(formatIds.map((id) => makeConfiguredFormat(id, visibleFormatIds)))
}

async function makeConfiguredFormat<T extends FormatId>(
  id: T,
  visibleFormatIds: FormatId[],
): Promise<ConfiguredFormat<T>> {
  const format = getFormat(id)

  const opts = (
    isFormatWithOptsId(id)
      ? ((await getFormatOpts(id)) ?? (format as FormatWithOpts).opts) // fall back to default opts
      : undefined
  ) as FormatOpts[T]

  return {
    id,
    label: format.label(opts),
    description: 'description' in format ? await format.description(opts) : undefined,
    visible: visibleFormatIds.includes(id),
    isDefault: visibleFormatIds[0] === id,
    transforms: format.transforms(opts),
    opts,
    isInvalid: 'isInvalid' in format ? format.isInvalid : undefined,
  }
}
