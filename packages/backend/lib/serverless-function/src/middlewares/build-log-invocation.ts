import { Logger } from '@app/logger'

import { InvocationContext } from '../invocation-context'

function defaultStartMessageFormatter(): string {
  return `event`
}

function defaultEndMessageFormatter(): string {
  return ``
}

export function buildLogInvocation<T>(
  startMessageFormatter: (context: InvocationContext<T>) => string = defaultStartMessageFormatter,
  endMessageFormatter: (context: InvocationContext<T>) => string = defaultEndMessageFormatter,
) {
  return async function logInvocation(context: InvocationContext<T>, next: Function): Promise<void> {
    const logger = Logger(context)

    const startTime = new Date()
    const startTimeStr = startTime.toISOString()
    const invocationStartMessage = startMessageFormatter(context)

    logger &&
      logger.info(`Handling ${invocationStartMessage}, started at ${startTimeStr}`, {
        type: 'invocation_start',
        startTime: startTimeStr,
      })

    logger && logger.debug(context.toString())

    try {
      await next()
    } finally {
      const endTime = new Date()
      const endTimeStr = endTime.toISOString()
      const duration = endTime.getTime() - startTime.getTime()
      const invocationEndMessage = endMessageFormatter(context)

      logger &&
        logger.info(
          `Handling ${invocationStartMessage} completed${invocationEndMessage} after ${duration}ms, started at ${startTime}, ended at ${endTime}`,
          {
            type: 'invocation_end',
            startTime: startTimeStr,
            endTime: endTimeStr,
            duration,
            response: context.response,
          },
        )
    }
  }
}
