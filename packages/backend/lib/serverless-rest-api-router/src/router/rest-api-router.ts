import { APIGatewayEvent, Context as AwsContext } from 'aws-lambda'

import { HttpMethod } from '@app/common'
import { Middleware } from '@app/serverless-function'

import { ApiGatewayResponse, baseHandlerBuilder } from '../rest-api'
import { RestApiRoute } from './rest-api-route'
import { Router } from './router'

export const RestApiRouter = ({
  context,
  middlewares = [],
  routes,
  prefix,
}: {
  context: {
    serviceName: string
    stage?: string
  }
  prefix?: string
  middlewares?: Middleware[]
  routes: RestApiRoute[]
}) => {
  const eventHandler = baseHandlerBuilder({ context, middlewares })
  const router = Router({ prefix, routes })

  return async (awsEvent: APIGatewayEvent, awsContext: AwsContext): Promise<ApiGatewayResponse> => {
    const url = awsEvent.pathParameters?.proxy?.startsWith('/')
      ? awsEvent.pathParameters?.proxy
      : `/${awsEvent.pathParameters?.proxy || ''}`

    const method = awsEvent.httpMethod
    const result = router.match({ method: method?.toUpperCase() as HttpMethod, url })

    if (result) {
      awsEvent.pathParameters = result.params
    }

    const response = result?.route
      ? await eventHandler(result.route.handler)(awsEvent, awsContext)
      : {
          statusCode: 404,
          body: {
            statusCode: 404,
            errorCode: 'RouteNotFoundError',
            message: `Route not found for ${method} ${url}`,
            meta: context.stage !== 'production' ? routes : undefined,
          },
        }

    const fullResponse = {
      statusCode: response.statusCode,
      body: JSON.stringify(response.body),
      headers: {
        ...(response.header ? response.header : {}),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }

    return fullResponse
  }
}
