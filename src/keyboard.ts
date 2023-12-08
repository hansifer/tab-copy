import { intl } from '@/intl'
import { clientInfo } from '@/util/client-info'
import { sentenceCase } from '@/util/string'

// tab copy actions (eg, copy, format selection) can have secondary and ternary action key modifiers that slightly modify the behavior of the action

export function hasSecondaryActionKeyModifier({
  metaKey,
  ctrlKey,
  altKey,
  shiftKey,
}: {
  metaKey: boolean
  ctrlKey: boolean
  altKey: boolean
  shiftKey: boolean
}) {
  return !shiftKey && hasPrincipalKeyModifier({ metaKey, ctrlKey, altKey })
}

export function hasTernaryActionKeyModifier({ shiftKey }: { shiftKey: boolean }) {
  return shiftKey
}

// the "principal" key modifier is either cmd (if mac) or ctrl/alt (if windows/linux)
function hasPrincipalKeyModifier({
  metaKey,
  ctrlKey,
  altKey,
}: {
  metaKey: boolean
  ctrlKey: boolean
  altKey: boolean
}) {
  return clientInfo.os === 'mac' ? metaKey : ctrlKey || altKey
}

export function getSecondaryActionKeyModifierLabel() {
  return clientInfo.os === 'mac' ? '⌘' : sentenceCase(intl.ctrl())
}

export function getTernaryActionKeyModifierLabel() {
  return clientInfo.os === 'mac' ? '⇧' : sentenceCase(intl.shift())
}
