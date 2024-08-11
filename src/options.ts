import { intl } from '@/intl'
import { getOptionValue } from '@/storage'

type OptionSpec = (typeof options)[number]

// Option distributive conditional type adds value prop with type inferred from def prop
type Option<T = OptionSpec> = T extends OptionSpec ? T & { value: T['def'] } : never
export type OptionId = Option['id']
export type OptionValue<T extends OptionId> = Extract<OptionSpec, { id: T }>['def']

export type BooleanOption = Extract<Option, { def: boolean }>
export type BooleanOptionId = BooleanOption['id']

// widen def prop type to allow value prop type to be inferred appropriately
const options = [
  {
    id: 'keepFormatSelectorExpanded',
    def: false as boolean,
    label: () => intl.keepFormatSelectorExpanded(),
    description: () => intl.keepFormatSelectorExpandedDescription(),
  },
  {
    id: 'showInContextMenu',
    def: true as boolean,
    label: () => intl.showInContextMenu(),
    description: () => intl.showInContextMenuDescription(),
  },
  {
    id: 'ignorePinnedTabs',
    def: false as boolean,
    label: () => intl.ignorePinnedTabs(),
    description: () => intl.ignorePinnedTabsDescription(),
  },
  {
    id: 'notifyOnCopy',
    def: false as boolean,
    label: () => intl.notifyOnCopy(),
    description: () => intl.notifyOnCopyDescription(),
  },
  {
    id: 'grayscaleIcon',
    def: false as boolean,
    label: () => intl.grayscaleIcon(),
    description: () => intl.grayscaleIconDescription(),
  },
] as const satisfies OptionSpecTemplate[]

type OptionSpecTemplate = {
  id: string
  def: any
  label: () => string
  description?: () => string
}

export const booleanOptionIds = options
  .filter((option) => typeof option.def === 'boolean') // destructuring here leads to incorrect booleanOptionIds type inference
  .map(({ id }) => id)

export async function getOption<T extends OptionId>(id: T) {
  const option = options.find((option) => option.id === id) as Extract<OptionSpec, { id: T }>

  const value = (await getOptionValue(id)) ?? option.def

  return {
    ...option,
    value,
  } as Option<typeof option>
}
