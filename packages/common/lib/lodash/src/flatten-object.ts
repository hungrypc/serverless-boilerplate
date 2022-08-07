import { isArray, isBoolean, isDate, isNil, isNumber, isObjectLike, isString } from '.'

type Primitive = number | string | boolean | Date | null | undefined

type Output = {
  [key: string]: Primitive | Array<unknown>
}

type FlattenOptions = {
  preserveArrays?: boolean
}

export const flattenObject = (input: unknown, options: FlattenOptions = {}): Output | Primitive => {
  if (isPrimitive(input)) {
    return input as Primitive
  }

  return _flattenObject(input, options)
}

const _flattenObject = (input: unknown, options: FlattenOptions, output: Output = {}, prefix?: string): Output => {
  if (isPrimitive(input)) {
    return {
      ...output,
      [prefix]: input as Primitive,
    }
  }

  if (isArray(input)) {
    input.forEach((e, index) => {
      output = _flattenObject(e, options, output, prefix ? `${prefix}.${index}` : `${index}`)
    })

    if (options.preserveArrays) {
      output[prefix] = input as Array<unknown>
    }

    return output
  }

  if (isObjectLike(input)) {
    Object.keys(input).forEach(key => {
      const value = (input as { [key: string]: unknown })[key]
      output = _flattenObject(value, options, output, prefix ? `${prefix}.${key}` : `${key}`)
    })
    return output
  }

  return output
}

const isPrimitive = (value: unknown): boolean => {
  return isBoolean(value) || isDate(value) || isNumber(value) || isString(value) || isNil(value)
}
