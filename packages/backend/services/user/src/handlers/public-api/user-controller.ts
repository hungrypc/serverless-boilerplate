import { Args, Controller, RestApiContext, Route, ServiceReturnType } from '@app/backend-framework'
import { PublicApi } from '@app/user-shared'

import { UserService } from '../../services'

const { routes } = PublicApi

export class UserController extends Controller {
  private service!: ServiceReturnType<typeof UserService, 'anonymous'>

  async initialize(context: RestApiContext) {
    super.initialize(context)
    this.service = await UserService(context).then(s => s.anonymous())
  }

  @Route(routes.testPublicApi)
  async testPublicApi({ pathParams: { userId } }: Args<typeof routes.testPublicApi>) {
    return this.service.testPublicApi({ userId })
  }
}
