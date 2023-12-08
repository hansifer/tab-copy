import { getFormatLabel, FormatId, FormatOptions } from '@/format'
import {
  getSelectableFormatIds,
  getAllFormatIds,
  getPrimaryFormatId,
  getFormatOption,
} from '@/storage'

export type ConfiguredFormat<T extends FormatId> = {
  id: T
  label: string
  selectable: boolean
  primary: boolean
  option: FormatOptions[T]
}

export async function getConfiguredFormat<T extends FormatId>(id: T) {
  const selectableFormatIds = await getSelectableFormatIds()
  const primaryFormatId = await getPrimaryFormatId()

  return makeConfiguredFormat(id, selectableFormatIds, primaryFormatId)
}

export async function getConfiguredFormats({ selectableOnly }: { selectableOnly?: boolean } = {}) {
  const selectableFormatIds = await getSelectableFormatIds()
  const primaryFormatId = await getPrimaryFormatId()

  const formatIds = selectableOnly // wrap
    ? selectableFormatIds
    : await getAllFormatIds()

  return Promise.all(
    formatIds.map((id) => makeConfiguredFormat(id, selectableFormatIds, primaryFormatId)),
  )
}

async function makeConfiguredFormat<T extends FormatId>(
  id: T,
  selectableFormatIds: FormatId[],
  primaryFormatId: FormatId,
): Promise<ConfiguredFormat<T>> {
  const label = await getFormatLabel(id)
  const option = await getFormatOption(id)

  return {
    id,
    label,
    selectable: selectableFormatIds.includes(id),
    primary: primaryFormatId === id,
    option,
  }
}
