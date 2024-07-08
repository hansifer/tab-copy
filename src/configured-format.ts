import { getFormatLabel, FormatId, FormatOptions } from '@/format'
import {
  // wrap
  getSelectableFormatIds,
  getAllFormatIds,
  getFormatOption,
} from '@/storage'

export type ConfiguredFormat<T extends FormatId> = {
  id: T
  label: string
  selectable: boolean
  isDefault: boolean // `default` is a JS reserved keyword; todo: consider removing this field and instead having implementation infer default format from selectableFormats[0] (currently only 1 instance (in popup.ts) would need to be updated)
  option: FormatOptions[T]
}

export async function getConfiguredFormat<T extends FormatId>(id: T) {
  const selectableFormatIds = await getSelectableFormatIds()

  return makeConfiguredFormat(id, selectableFormatIds)
}

export async function getConfiguredFormats({ selectableOnly }: { selectableOnly?: boolean } = {}) {
  const selectableFormatIds = await getSelectableFormatIds()

  const formatIds = selectableOnly // wrap
    ? selectableFormatIds
    : await getAllFormatIds()

  return Promise.all(formatIds.map((id) => makeConfiguredFormat(id, selectableFormatIds)))
}

async function makeConfiguredFormat<T extends FormatId>(
  id: T,
  selectableFormatIds: FormatId[],
): Promise<ConfiguredFormat<T>> {
  const label = await getFormatLabel(id)
  const option = await getFormatOption(id)

  return {
    id,
    label,
    selectable: selectableFormatIds.includes(id),
    isDefault: selectableFormatIds[0] === id,
    option,
  }
}
