import { BaseDictionary, Utils } from './'

export const headerManager = {
  authorizationBearer: {
    build: (token: string) => ({
      Authorization: `Bearer ${token}`,
    }),
    parse: (headers?: BaseDictionary<string>) => {
      const authorization = Utils.insensitiveGet(headers, 'Authorization')
      const splitted = authorization?.split(' ')
      return splitted && splitted.length > 1 ? splitted[1] : undefined
    },
  },
  accessToken: {
    build: (token: string) => ({
      'Access-Token': token,
    }),
    parse: (headers?: BaseDictionary<string>) => {
      return Utils.insensitiveGet(headers, 'Access-Token')
    },
  },
}
