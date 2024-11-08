import { intl } from '@/intl'
import { getOptionValue } from '@/storage'

type OptionSpec = (typeof options)[number]

// Option distributive conditional type adds value prop with type inferred from def prop
type Option<T = OptionSpec> = T extends OptionSpec ? T & { value: T['def'] } : never
export type OptionId = Option['id']
export type OptionValue<T extends OptionId> = Extract<OptionSpec, { id: T }>['def']

export type BooleanOption = Extract<Option, { def: boolean }>
export type BooleanOptionId = BooleanOption['id']

// a subOption is an option whose UI visibility requires the value of a depending boolean option to be `true`
export type SubOption<T extends OptionId = OptionId> = Extract<OptionSpec, { requires: T }>
type TopLevelOption = Exclude<OptionSpec, SubOption>

// widen def prop type to allow value prop type to be inferred appropriately
const options = [
  {
    id: 'keepFormatSelectorExpanded',
    def: false as boolean,
    label: () => intl.keepFormatSelectorExpanded(),
    description: () => intl.keepFormatSelectorExpandedDescription(),
  },
  {
    id: 'showTabCounts',
    def: false as boolean,
    label: () => intl.showTabCounts(),
    description: () => intl.showTabCountsDescription(),
  },
  {
    id: 'showContextMenu',
    def: true as boolean,
    label: () => intl.showContextMenu(),
    description: () => intl.showContextMenuDescription(),
  },
  {
    id: 'provideContextMenuFormatSelection',
    def: true as boolean,
    label: () => intl.provideContextMenuFormatSelection(),
    description: () => intl.provideContextMenuFormatSelectionDescription(),
    requires: 'showContextMenu',
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
    requiresPermissions: ['notifications'],
  },
  {
    id: 'invertIcon',
    def: false as boolean,
    label: () => intl.invertIcon(),
    description: () => intl.invertIconDescription(),
  },
] as const satisfies OptionSpecTemplate[]

type OptionSpecTemplate = {
  id: string
  def: any
  label: () => string
  description?: () => string
  requiresPermissions?: chrome.runtime.ManifestPermissions[]
  requires?: string // top-level option id that this sub-option depends on
}

export const topLevelBooleanOptionIds = options
  .filter((option) => isTopLevelOption(option) && isBooleanOption(option))
  .map(({ id }) => id)

export function getSubOptions<T extends BooleanOptionId>(optionId: T) {
  return options.filter(
    (option) => isSubOption(option) && option.requires === optionId,
  ) as SubOption<T>[]
}

export async function getOption<T extends OptionId>(id: T) {
  const option = options.find((option) => option.id === id) as Extract<OptionSpec, { id: T }>

  const value = (await getOptionValue(id)) ?? option.def

  return {
    ...option,
    value,
  } as Option<typeof option>
}

export function isBooleanOption(option: OptionSpec): option is BooleanOption {
  return typeof option.def === 'boolean'
}

export function isSubOption(option: OptionSpec): option is SubOption {
  return 'requires' in option
}

export function isTopLevelOption(option: OptionSpec): option is TopLevelOption {
  return !isSubOption(option)
}
