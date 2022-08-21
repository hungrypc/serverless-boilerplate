import { AuthLevel, generateApiPath } from '@app/backend-framework'

const paths = {
  user: generateApiPath({ prefix: AuthLevel.AUTH, name: 'user' }),
}

export { paths }
