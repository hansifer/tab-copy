import { LeftRightArrowIcon } from '@/icons/LeftRightArrowIcon'
import { UpDownArrowsIcon } from '@/icons/UpDownArrowsIcon'
import { StarIcon } from '@/icons/StarIcon'
import { HiddenIcon } from '@/icons/HiddenIcon'
import { intl } from '@/intl'

type OptionTip = {
  id: string
  icon: JSX.Element
  text: () => string
}

export const scopeOptionTips = [
  {
    id: 'copy-button-scopes',
    icon: <LeftRightArrowIcon size={24} />,
    text: () => intl.optionTipText.copyButtonScopes(),
  },
  {
    id: 'hidden-scopes',
    icon: <HiddenIcon size={24} />,
    text: () => intl.optionTipText.hiddenScopes(),
  },
] as const satisfies OptionTip[]

export const formatOptionTips = [
  {
    id: 'format-order',
    icon: <UpDownArrowsIcon size={24} />,
    text: () => intl.optionTipText.formatOrder(),
  },
  {
    id: 'default-format',
    icon: <StarIcon size={24} />,
    text: () => intl.optionTipText.defaultFormat(),
  },
  {
    id: 'hidden-formats',
    icon: <HiddenIcon size={24} />,
    text: () => intl.optionTipText.hiddenFormats(),
  },
] as const satisfies OptionTip[]

export const optionTips = [
  // ...generalOptionTips, // if needed
  ...scopeOptionTips,
  ...formatOptionTips,
] as const

export type OptionTipId = (typeof optionTips)[number]['id']
