type Parseable = string | number | boolean

export const toQueryParamsString = (queryParams: Record<string, Parseable | Parseable[]>, transformArray = true) => {
  return Object.entries(queryParams)
    .map(([key, value]) =>
      Array.isArray(value) && transformArray
        ? value.map((e, index) => `${key}[${index}]=${e}`).join('&')
        : `${key}=${value}`,
    )
    .join('&')
}
