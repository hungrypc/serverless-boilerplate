import { BaseRestApiContext } from './base-rest-api-context'

export interface RestApiContext extends BaseRestApiContext {
  token?: string
}
