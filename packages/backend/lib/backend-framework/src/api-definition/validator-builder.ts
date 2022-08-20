import { yup } from '@app/yup-util'

const validatorBuilder = {
  buildPayloadValidator: <T extends object>(schema: yup.ObjectSchema<T>) => {
    return (payload: unknown) => schema.validate(payload) as Promise<Partial<T>>
  },
  buildParamsValidator: <T extends object>(schema: yup.ObjectSchema<T>) => {
    return (params: unknown) => schema.validate(params) as Promise<T>
  },
  buildResponseValidator: <R>() => {
    return (response: unknown) => Promise.resolve(response as R)
  },
}

export { validatorBuilder }
