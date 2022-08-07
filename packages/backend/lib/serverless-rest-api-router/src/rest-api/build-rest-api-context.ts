import { APIGatewayEvent } from 'aws-lambda'
import uuid from 'uuid'

import { StatusCodes, Utils } from '@app/common'
import { isJsonParseable } from '@app/lodash'
import { InvocationContext } from '@app/serverless-function'

import { RestApiContext } from './rest-api-context'

export function buildRestApiContext(
  context: InvocationContext<APIGatewayEvent>,
  awsEvent: APIGatewayEvent,
): RestApiContext {
  let token: string

  // if (awsEvent.requestContext && awsEvent.requestContext.authorizer) {
  //   const authorizer = awsEvent.requestContext.authorizer

  //   // can set user or whatever here after setting data via generatePolicy
  // }

  let body = null
  try {
    body = awsEvent.body ? JSON.parse(awsEvent.body) : null
  } catch (err) {
    console.log(err)
  }

  const parseQueryParams = (queryParams: { [key in string]?: string } = {}) =>
    Object.keys(queryParams || {}).reduce((parsed, key) => {
      const value = queryParams[key]
      parsed[key] = isJsonParseable(value) ? JSON.parse(value) : value
      return parsed
    }, {} as { [key in string]?: string })

  return {
    ...context,
    correlatedRequestId: Utils.insensitiveGet(awsEvent.headers, 'X-Correlated-Request-Id') || uuid.v4(),
    token,
    request: {
      url: awsEvent.path,
      method: awsEvent.httpMethod,
      header: awsEvent.headers,
      body,
      query: parseQueryParams(awsEvent.queryStringParameters),
      params: awsEvent.pathParameters,
    },
    response: {
      statusCode: StatusCodes.NOT_FOUND,
      body: {},
      header: {},
    },
  }
}
