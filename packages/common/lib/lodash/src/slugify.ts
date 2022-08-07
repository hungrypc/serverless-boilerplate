import { default as slugify } from 'slugify'

const slugifyLowercase = (str: string) =>
  slugify(str, {
    lower: true,
    strict: true,
  })

export { slugify, slugifyLowercase }
