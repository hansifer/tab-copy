import { intl } from '@/intl'

type OptionTip = {
  id: string
  icon: JSX.Element
}

const hiddenSvg = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line
      x1="2"
      x2="22"
      y1="2"
      y2="22"
    />
  </svg>
)

// --- 1. add new option tip below ---

export const scopeOptionTips = [
  {
    id: 'copy-button-scopes',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 8 22 12 18 16" />
        <polyline points="6 8 2 12 6 16" />
        <line
          x1="2"
          x2="22"
          y1="12"
          y2="12"
        />
      </svg>
    ),
  },
  {
    id: 'hidden-scopes',
    icon: hiddenSvg,
  },
] as const satisfies OptionTip[]

export const formatOptionTips = [
  {
    id: 'format-order',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 16 4 4 4-4" />
        <path d="M7 20V4" />
        <path d="m21 8-4-4-4 4" />
        <path d="M17 4v16" />
      </svg>
    ),
  },
  {
    id: 'default-format',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'hidden-formats',
    icon: hiddenSvg,
  },
] as const satisfies OptionTip[]

export const optionTips = [
  // ...generalOptionTips, // if needed
  ...scopeOptionTips,
  ...formatOptionTips,
] as const

// --- 2. add text for new option tip by creating an intl function with same name as option tip id ---

export function getOptionTipText(id: OptionTipId) {
  return intl.optionTipText[id]()
}

export type OptionTipId = (typeof optionTips)[number]['id']
