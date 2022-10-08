import { AuthLevel, generateApiPath } from '@app/backend-framework'

const paths = {
  analytics: generateApiPath({ prefix: AuthLevel.AUTH, name: 'analytics' }),
}

export { paths }
