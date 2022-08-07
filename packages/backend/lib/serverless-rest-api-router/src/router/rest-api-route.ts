import { RestApiContext } from '../rest-api'
import { Route } from './route'

export interface RestApiRoute extends Route {
  handler: (ctx: RestApiContext, next: () => void) => Promise<void>
}
