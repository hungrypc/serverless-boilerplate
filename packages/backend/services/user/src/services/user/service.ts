import { Context } from '@app/common'

export const Service = async (_context: Context) => {
  return {
    auth: async () => {
      return {
        testApi: ({ userId, api }: { userId: string; api: string }) => {
          return `${api} api test success, ${userId}`
        },
      }
    },
  }
}
