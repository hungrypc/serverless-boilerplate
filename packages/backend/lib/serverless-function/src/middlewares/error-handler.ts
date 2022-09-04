import { BaseError, Context as BaseContext, StatusCodes } from '@app/common'
import { Logger } from '@app/logger'

type Context = BaseContext & {
  request?: unknown
}

// async function captureException(context: Context, err: Error): Promise<void> {
//   // for 3rd party tools (like sentry)
// }

interface ContextWithResponse extends Context {
  response?: Record<string, any>
}

export async function errorHandler(context: ContextWithResponse, next: Function): Promise<void> {
  const logger = Logger(context)

  try {
    await next()
  } catch (error) {
    logger.error(error.stack)

    if (!context.response || !context.response.statusCode) {
      // await captureException(context, error)
      return
    }

    if (error instanceof BaseError) {
      context.response.statusCode = error.statusCode
      context.response.body = error.toDict()
    } else {
      context.response.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      context.response.body = {
        statusCode: context.response.statusCode,
        errorCode: error.name,
        message: error.message,
      }
    }

    if (context.stage === 'production') {
      context.response.body.message = context.response.body.errorCode
    }

    const isTest = context.stage === 'test'
    if (context.response.statusCode === StatusCodes.INTERNAL_SERVER_ERROR && !isTest) {
      // await captureException(context, error)
    }

    const isDebug = !!process.env?.DEBUG
    if (isDebug) {
      console.error(error)
    }
  }
}
