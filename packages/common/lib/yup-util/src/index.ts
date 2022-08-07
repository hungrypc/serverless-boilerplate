import * as yup from 'yup'

export { yup }

export type TypeOf<T extends yup.Schema<unknown>> = T extends yup.Schema<infer P> ? P : never

export function validateSync<T>(schema: yup.Schema<T>, value: unknown): T {
  return schema.validateSync(value, { stripUnknown: true })
}

export function validate<T>(schema: yup.Schema<T>, value: unknown): yup.InferType<typeof schema> {
  return schema.validate(value, { stripUnknown: true }) as yup.InferType<typeof schema>
}
