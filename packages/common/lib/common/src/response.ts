import { BaseDictionary, StatusCodes } from './'

export interface Response {
  body?: BaseDictionary
  header?: Record<string, string>
  statusCode: StatusCodes
}
