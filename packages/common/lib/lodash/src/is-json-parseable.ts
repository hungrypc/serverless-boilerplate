export const isJsonParseable = (value: string) => {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}
