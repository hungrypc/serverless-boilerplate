import { handlerBuilder, Middleware } from '@app/serverless-function'

import { handlePayloadValidationError } from '../middlewares'
import { APIGatewayEvent, buildRestApiContext, RestApiContext } from './'
import { requestLogFormatter, responseLogFormatter } from './formatters'

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
    requestLogFormatter,
    responseLogFormatter,
  )
