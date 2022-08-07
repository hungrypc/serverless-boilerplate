import { APIGatewayProxyEvent, Context } from 'aws-lambda'

import { DeepPartial } from '@app/ts-utils'

import { restApi } from './default-config'
import { eventBridgeFunction, prefixedRestApiProxyFunction } from './default-config/functions'
import { Serverless } from './types'
import { merge } from './utils'

type Handler = (awsEvent: APIGatewayProxyEvent, awsContext: Context) => Promise<unknown>
type GenericHandler = (awsEvent: any, awsContext: Context) => Promise<unknown>

type ApiHandlers = {
  authenticatedApi?: Handler
  publicApi?: Handler
}

type EventBridgeHandler = {
  handler: GenericHandler
  eventTypes: {
    context: string | string[]
    entity: string | string[]
    type: string | string[]
  }[]
}

export const generateServerlessRestApiConfig = ({
  stage,
  serviceName,
  apiHandlers,
  eventBridgeHandler,
  functionFilePath = 'dist/index',
  monitored,
  ...other
}: {
  stage: string
  serviceName: string
  apiHandlers?: ApiHandlers
  eventBridgeHandler?: EventBridgeHandler
  functionFilePath?: string
  monitored?: boolean
} & DeepPartial<Serverless>): Serverless => {
  const apiFunctions = apiHandlers
    ? Object.entries(apiHandlers).reduce(
        (acc, [functionName]: [keyof ApiHandlers, any]) => ({
          ...acc,
          ...prefixedRestApiProxyFunction({
            functionName,
            handler: `${functionFilePath}.${functionName}`,
          }),
        }),
        {},
      )
    : {}

  const eventBridgeFunctions = eventBridgeHandler
    ? eventBridgeFunction({
        functionName: 'ebridge',
        handler: `${functionFilePath}.eventBridgeHandler`,
        eventTypes: eventBridgeHandler.eventTypes,
      })
    : {}

  return merge(restApi({ serviceName, stage, monitored }), [
    {
      functions: {
        ...apiFunctions,
        ...eventBridgeFunctions,
      },
    },
    other,
  ])
}

export const generateServerlessConfig = generateServerlessRestApiConfig
