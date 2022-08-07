import { APIGatewayProxyEvent, Context } from 'aws-lambda'

import { DeepPartial } from '@app/ts-utils'

import { restApi } from './default-config'
import { eventBridgeFunction, prefixedRestApiProxyFunction, s3EventFunction } from './default-config/functions'
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

type S3EventHandler = {
  handler: GenericHandler
  eventTypes: string[]
  bucketName: string
}

export const generateServerlessRestApiConfig = ({
  stage,
  serviceName,
  apiHandlers,
  eventBridgeHandler,
  s3EventHandler,
  functionFilePath = 'dist/index',
  monitored,
  ...other
}: {
  stage: string
  serviceName: string
  apiHandlers?: ApiHandlers
  eventBridgeHandler?: EventBridgeHandler
  s3EventHandler?: S3EventHandler
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

  const s3EventFunctions = s3EventHandler
    ? s3EventFunction({
        functionName: 's3EventHandler',
        handler: `${functionFilePath}.s3EventHandler`,
        eventTypes: s3EventHandler.eventTypes,
        bucketName: s3EventHandler.bucketName,
      })
    : {}

  return merge(restApi({ serviceName, stage, monitored }), [
    {
      functions: {
        ...apiFunctions,
        ...eventBridgeFunctions,
        ...s3EventFunctions,
      },
    },
    other,
  ])
}

export const generateServerlessConfig = generateServerlessRestApiConfig
