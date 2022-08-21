import { yup } from '@app/yup-util'

export const byUserId = yup.object({
  userId: yup.string().required(),
})
