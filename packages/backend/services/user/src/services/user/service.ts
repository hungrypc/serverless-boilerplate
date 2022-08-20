import { Context } from '@app/common'

export const Service = async (_context: Context) => {
  return {
    auth: async () => {
      return {
        testApi: ({ userId }: { userId: string }) => {
          return `GET success, ${userId}`
        },
      }
    },
  }
}
