import { HttpMethod } from '@app/common'

export interface Route {
  method: HttpMethod
  path: string
}
