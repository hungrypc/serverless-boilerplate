import { RouteDefinition } from '../api-definition'
import { ApiHandlerFunction } from './api-handler-function'
import { buildHandler } from './build-handler'
import { Controller } from './controller'
import { addRoute } from './router'

export const Route = <T extends RouteDefinition>(routeDefinition: T) => {
  return (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<ApiHandlerFunction<T>>) => {
    addRoute({
      ...routeDefinition,
      handler: buildHandler(target, routeDefinition, propertyKey),
    })

    return descriptor
  }
}
