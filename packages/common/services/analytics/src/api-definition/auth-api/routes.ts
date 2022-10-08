import { HttpMethod } from '@app/common'

import { paths } from './paths'

const BASE_ANALYTICS_URL = paths.analytics.all.base()

export const routes = {
  getWebsiteAnalytics: {
    path: BASE_ANALYTICS_URL,
    method: HttpMethod.GET,
    authenticated: true,
    responseValidator: (response: unknown) => Promise.resolve(response as string),
  },
}
