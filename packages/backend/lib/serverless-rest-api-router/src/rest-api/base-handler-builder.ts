import { handlerBuilder, Middleware } from '@app/serverless-function'

import { handlePayloadValidationError } from '../middlewares'
import { APIGatewayEvent, buildRestApiContext, RestApiContext } from '.'

export const baseHandlerBuilder = ({
  context,
  middlewares,
}: {
  context: {
    serviceName: string
    stage?: string
  }
  middlewares: Middleware[]
}) =>
  handlerBuilder<APIGatewayEvent, RestApiContext>(
    context,
    [handlePayloadValidationError, ...middlewares],
    buildRestApiContext,
  )
