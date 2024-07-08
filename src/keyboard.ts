import { intl } from '@/intl'
import { clientInfo } from '@/util/client-info'
import { sentenceCase } from '@/util/string'

// tab copy can have secondary and ternary key modifiers that slightly modify behavior

export function hasSecondaryActionKeyModifier({
  metaKey,
  ctrlKey,
  shiftKey,
}: {
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
}) {
  return !shiftKey && hasCtrlOrMeta({ metaKey, ctrlKey })
}

export function hasTernaryActionKeyModifier({
  metaKey,
  ctrlKey,
  shiftKey,
}: {
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
}) {
  return shiftKey && hasCtrlOrMeta({ metaKey, ctrlKey })
}

function hasCtrlOrMeta({ metaKey, ctrlKey }: { metaKey: boolean; ctrlKey: boolean }) {
  return clientInfo.os === 'mac' ? metaKey : ctrlKey
}

export function getSecondaryActionKeyModifierLabel() {
  return clientInfo.os === 'mac' ? '⌘' : sentenceCase(intl.ctrl())
}

// ternary can't be shift only since that's used for reverse-direction tabbing
export function getTernaryActionKeyModifierLabel() {
  return clientInfo.os === 'mac'
    ? intl.keyModifier('⌘', '⇧')
    : intl.keyModifier(sentenceCase(intl.ctrl()), sentenceCase(intl.shift()))
}
