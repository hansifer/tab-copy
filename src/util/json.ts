export function jsonParse(text: string) {
  try {
    return JSON.parse(text)
  } catch (ex) {}
}
