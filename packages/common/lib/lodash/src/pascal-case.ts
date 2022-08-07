import { camelCase, upperFirst } from '.'

export const pascalCase = (str: string) => upperFirst(camelCase(str))
