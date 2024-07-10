export function isButton(el: any): el is HTMLButtonElement {
  return HTMLButtonElement.prototype.isPrototypeOf(el)
}

// add a listener to multiple elements
export function addListener<T extends HTMLElement[], U extends keyof HTMLElementEventMap>(
  els: T,
  type: U | U[],
  listener: (this: T[number], ev: HTMLElementEventMap[U]) => any,
) {
  const types = Array.isArray(type) ? type : [type]

  types.forEach((type) => {
    els.forEach((el) => el.addEventListener(type, listener))
  })
}

export function getElement<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T
}

export function queryElement<T extends HTMLElement>(query: string) {
  return document.querySelector(query) as T
}

export const getSpan = getElement<HTMLSpanElement>
export const getDiv = getElement<HTMLDivElement>
export const getButton = getElement<HTMLButtonElement>

// inserts text at the current cursor position of an input element. replaces any selection.
// sets cursor position to end of inserted text, adjusting for passed cursorOffset
// returns new value
export function insertInputText(input: HTMLInputElement, text: string, cursorOffset = 0) {
  const selectionStart = input.selectionStart == null ? input.value.length : input.selectionStart
  const selectionEnd = input.selectionEnd == null ? selectionStart : input.selectionEnd

  input.value = `${input.value.slice(0, selectionStart)}${text}${input.value.slice(selectionEnd)}`

  // move cursor to end of inserted text, adjusting for passed cursorOffset
  input.selectionStart = input.selectionEnd = selectionStart + text.length + cursorOffset

  return input.value
}
