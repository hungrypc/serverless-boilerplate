import { AnalyticEvent } from '@app/analytics-shared'
import { Context, Logger } from '@app/backend-framework'

export const Service = async (context: Context) => {
  const logger = Logger(context)

  return {
    auth: async () => {
      return {
        getWebsiteAnalytics: () => {
          return 'ok'
        },
      }
    },
    anonymous: async () => {
      return {
        sendOneAnalyticEvent: ({ payload }: { payload: AnalyticEvent }) => {
          logger.info('received event', { payload })

          return 'ok'
        },
      }
    },
  }
}
