import { PublicApi } from '@app/analytics-shared'
import { Args, Controller, RestApiContext, Route, ServiceReturnType } from '@app/backend-framework'

import { AnalyticsService } from '../../services'

const { routes } = PublicApi

export class AnalyticsController extends Controller {
  private service!: ServiceReturnType<typeof AnalyticsService, 'anonymous'>

  async initialize(context: RestApiContext) {
    super.initialize(context)
    this.service = await AnalyticsService(context).then(s => s.anonymous())
  }

  @Route(routes.sendOneAnalyticEvent)
  async sendOneAnalyticEvent({ payload }: Args<typeof routes.sendOneAnalyticEvent>) {
    return this.service.sendOneAnalyticEvent({ payload })
  }
}
