export function isButton(el: any): el is HTMLButtonElement {
  return HTMLButtonElement.prototype.isPrototypeOf(el)
}

// add a listener to multiple elements
export function addListener<T extends HTMLElement[], U extends keyof HTMLElementEventMap>(
  els: T,
  type: U,
  listener: (this: T[number], ev: HTMLElementEventMap[U]) => any,
) {
  els.forEach((el) => el.addEventListener(type, listener))
}
