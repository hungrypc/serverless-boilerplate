import { StatusCodes } from '@app/common'
import { RestApiContext } from '@app/serverless-rest-api-router'

import { Args, PathParamsType, PayloadType, QueryParamsType, RouteDefinition } from '../api-definition'
import { ApiHandlerFunction } from './api-handler-function'
import { Controller } from './controller'

export const buildHandler = <T extends RouteDefinition, C extends Controller>(
  controller: C,
  routeDefinition: T,
  methodName: string,
) => {
  return async (context: RestApiContext, next: Function): Promise<void> => {
    const { pathParamsValidator, queryParamsValidator, payloadValidator } = routeDefinition

    const pathParams = await pathParamsValidator?.(context.request.params)
    const queryParams = await queryParamsValidator?.(context.request.query)
    const body = await payloadValidator?.(context.request.body)

    await controller.initialize(context)

    const args: Parameters<ApiHandlerFunction<T>>[0] = {
      payload: body as PayloadType<T>,
      queryParams: queryParams as QueryParamsType<T>,
      pathParams: pathParams as PathParamsType<T>,
    } as unknown as Args<T>

    context.response.body = {
      data: await (controller as any)[methodName](args),
    }

    context.response.statusCode = routeDefinition.successStatusCode || StatusCodes.OK

    next()
  }
}
