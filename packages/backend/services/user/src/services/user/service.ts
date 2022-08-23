import { Context } from '@app/common'

export const Service = async (_context: Context) => {
  return {
    auth: async () => {
      return {
        testAuthApi: ({ userId }: { userId: string }) => {
          return `auth api test success, ${userId}`
        },
      }
    },
    anonymous: async () => {
      return {
        testPublicApi: ({ userId }: { userId: string }) => {
          return `public api test success, ${userId}`
        },
      }
    },
  }
}
