// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseBoolean = (value: any): boolean => {
  if (value === 'true') return true
  if (value === 'false') return false

  return new Boolean(value).valueOf()
}
