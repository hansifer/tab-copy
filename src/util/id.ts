import { customAlphabet } from 'nanoid'

// do not update to allow punctuation characters

export const newId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6,
)
