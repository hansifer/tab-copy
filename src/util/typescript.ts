// https://stackoverflow.com/a/49752227/384062
export type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any
}
