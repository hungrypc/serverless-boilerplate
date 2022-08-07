import { APIGatewayEvent, Context as AwsContext } from 'aws-lambda'

import { Response as RestApiResponse } from '@app/common'
import { Middleware } from '@app/serverless-function'

import { ApiGatewayResponse } from './api-gateway-response'
import { baseHandlerBuilder } from './base-handler-builder'

export function requestHandlerBuilder(
  context: {
    serviceName: string
    stage?: string
  },
  middlewares: Middleware[] = [],
) {
  return (handler: Middleware) => {
    const eventHandlerBuilder = baseHandlerBuilder({ context, middlewares })

    return async (awsEvent: APIGatewayEvent, awsContext: AwsContext): Promise<ApiGatewayResponse> => {
      const eventHandler = eventHandlerBuilder(handler)
      const response = (await eventHandler(awsEvent, awsContext)) as RestApiResponse

      return {
        statusCode: response.statusCode,
        body: JSON.stringify(response.body),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
      }
    }
  }
}
