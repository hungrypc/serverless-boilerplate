import { yup } from '@app/yup-util'

import { AnalyticEvent, AnalyticEventType } from '../../../entity'

export const analyticEventPayloadValidator = yup.object<AnalyticEvent>({
  domain: yup.string().required(),
  eventType: yup.string().oneOf(Object.values(AnalyticEventType)).required(),
  referer: yup.string().nullable(),
  url: yup.string().required(),
  clientWidth: yup.number().required(),
})
