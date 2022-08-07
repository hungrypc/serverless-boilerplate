import { mergeWith } from '@app/lodash'

const concatArray = (objValue: Record<string, unknown>, srcValue: Record<string, unknown>) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

export const merge = (object: Parameters<typeof mergeWith>[0], sources: Parameters<typeof mergeWith>[1]) => {
  return mergeWith(object, ...sources, concatArray)
}
