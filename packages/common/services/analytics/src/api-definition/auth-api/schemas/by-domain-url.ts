import { yup } from '@app/yup-util'

export const byDomainUrl = yup.object({
  domainUrl: yup.string().required(),
})
