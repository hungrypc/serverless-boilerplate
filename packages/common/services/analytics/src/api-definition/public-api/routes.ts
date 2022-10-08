import { HttpMethod } from '@app/common'

import { paths } from './paths'
import { analyticEventPayloadValidator } from './schemas'

export const routes = {
  sendOneAnalyticEvent: {
    path: `${paths.analytics.all.base()}/event`,
    method: HttpMethod.POST,
    authenticated: false,
    payloadValidator: (payload: unknown) => analyticEventPayloadValidator.validate(payload),
    responseValidator: (response: unknown) => Promise.resolve(response as string),
  },
}
