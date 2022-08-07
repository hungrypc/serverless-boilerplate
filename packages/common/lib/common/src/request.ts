import { BaseDictionary } from './dictionary'

type StringDictionary = BaseDictionary<string>
type StringArrayDictionary = BaseDictionary<string | string[]>

export interface Request {
  header: StringDictionary
  body?: BaseDictionary
  query?: StringArrayDictionary
  params?: StringDictionary
  url: string
  method: string
}
