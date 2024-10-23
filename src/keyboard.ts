import { intl } from '@/intl'
import { clientInfo } from '@/util/client-info'
import { sentenceCase } from '@/util/string'

// tab copy can have secondary and ternary modifier keys that slightly modify behavior

export function hasSecondaryActionModifierKey({
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

export function hasTernaryActionModifierKey({
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

export function getSecondaryActionModifierKeyLabel() {
  return clientInfo.os === 'mac' ? '⌘' : sentenceCase(intl.ctrl())
}

// ternary can't be shift only since that's used for reverse-direction tabbing
export function getTernaryActionModifierKeyLabel() {
  return clientInfo.os === 'mac'
    ? intl.modifierKey('⌘', '⇧')
    : intl.modifierKey(sentenceCase(intl.ctrl()), sentenceCase(intl.shift()))
}
