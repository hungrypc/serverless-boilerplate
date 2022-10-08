import { RestApiRouter } from '@app/backend-framework'

import { config } from '../../config'
import * as Controllers from './controllers'

export const authenticatedApi = RestApiRouter({
  context: config,
  prefix: 'auth',
  controllers: Object.values(Controllers),
})
