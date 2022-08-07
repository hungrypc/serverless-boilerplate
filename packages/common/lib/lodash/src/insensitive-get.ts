export const insensitiveGet = (obj: Record<string, string>, searchKey: string): string | undefined => {
  if (!obj) {
    return
  }

  return obj[Object.keys(obj).find(key => key.toLowerCase() === searchKey.toLowerCase())]
}
