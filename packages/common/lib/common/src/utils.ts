import { BaseDictionary } from './dictionary'

export function insensitiveGet(dict: BaseDictionary<string> | undefined, searchKey: string): string | undefined {
  if (!dict) {
    return
  }

  return dict[Object.keys(dict).find(key => key.toLowerCase() === searchKey.toLowerCase())]
}
