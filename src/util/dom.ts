export function isButton(el: any): el is HTMLButtonElement {
  return HTMLButtonElement.prototype.isPrototypeOf(el)
}
