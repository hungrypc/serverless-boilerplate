import { RestApiContext } from '@app/common'
import { Middleware } from '@app/serverless-function'
import { RestApiRouter as BaseRestApiRouter, Route } from '@app/serverless-rest-api-router'

const routes: RestApiRoute[] = []

type RouterArgs = {
  context: {
    serviceName: string
    stage?: string
  }
  prefix?: string
  middlewares?: Middleware[]
  controllers: any[]
}

export interface RestApiRoute extends Route {
  handler: (ctx: RestApiContext, next: () => void) => Promise<void>
}

export const RestApiRouter = ({ context, middlewares = [], prefix }: RouterArgs) => {
  return BaseRestApiRouter({ context, middlewares, routes, prefix })
}

export const addRoute = (route: RestApiRoute) => {
  return routes.push(route)
}
