import { AuthenticatedApi } from '@app/analytics-shared'
import { Controller, RestApiContext, Route, ServiceReturnType } from '@app/backend-framework'

import { AnalyticsService } from '../../services'

const { routes } = AuthenticatedApi

export class AnalyticsController extends Controller {
  private service!: ServiceReturnType<typeof AnalyticsService, 'auth'>

  async initialize(context: RestApiContext) {
    super.initialize(context)
    this.service = await AnalyticsService(context).then(s => s.auth())
  }

  @Route(routes.getWebsiteAnalytics)
  async getWebsiteAnalytics() {
    return this.service.getWebsiteAnalytics()
  }
}
