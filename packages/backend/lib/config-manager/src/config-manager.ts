import { ConfigValues } from '@app/global-config'

import { MissingConfigurationError } from './errors'
import { SSMClient } from './ssm-client'
import { ConfigElement, Context, Parameter, Parameters } from './types'

const CACHE_EXPIRATION_IN_MILLISECONDS = 300000
const IS_JSON_LIKE_REGEX = /^({|\[)/

const cachedParameters: { [key: string]: Parameters | null } = {}
let expiredAt: number

export function ConfigManager(context: Context) {
  const client = new SSMClient(context)

  const cachedParametersAreExpired = (): boolean => {
    return !expiredAt || expiredAt < Date.now()
  }

  const fetchAllParameters = async (): Promise<Parameters> => {
    const globalParameters = await client.fetchParametersByPath(`/${context.stage}/global/`)
    return {
      ...globalParameters,
    }
  }

  const getAndCacheParameters = async (): Promise<Parameters> => {
    if (!cachedParameters[context.stage] || cachedParametersAreExpired()) {
      cachedParameters[context.stage] = await fetchAllParameters()
      expiredAt = Date.now() + CACHE_EXPIRATION_IN_MILLISECONDS
    }

    return cachedParameters[context.stage] as Parameters
  }

  const getParameter = async (key: string): Promise<Parameter | undefined> => {
    const defaultConfig = context?.config?.environmentVariables || {}

    if (defaultConfig[key] && typeof defaultConfig[key] === 'string') {
      return {
        value: defaultConfig[key] as string,
        from: 'default',
        type: 'String',
      }
    } else if (defaultConfig[key]) {
      return defaultConfig[key] as Parameter
    } else {
      const parameters = await getAndCacheParameters()
      return parameters[key]
    }
  }

  return {
    init: async () => {
      await getAndCacheParameters()
    },
    get: async <T extends ConfigElement>(key: T): Promise<ConfigValues[typeof key]> => {
      const parameter = await getParameter(key as string)

      if (!parameter || !parameter.value) {
        cachedParameters[context.stage] = null

        throw new MissingConfigurationError(key as string)
      }

      if (parameter.type !== 'SecureString') {
        !context.silent &&
          client.logger.debug(
            `Found parameter for ${key as string} from ${parameter.from} with value ${parameter.value}`,
          )
      } else {
        !context.silent &&
          client.logger.debug(`Found parameter for ${key as string} from ${parameter.from} with value HIDDEN`)
      }

      if (IS_JSON_LIKE_REGEX.test(parameter.value)) {
        try {
          return JSON.parse(parameter.value) as ConfigValues[typeof key]
        } catch {
          return parameter.value as ConfigValues[typeof key]
        }
      } else {
        return parameter.value as ConfigValues[typeof key]
      }
    },
    set: async (
      key: ConfigElement,
      value: ConfigValues[typeof key],
      isSecure = false,
      overwrite = false,
    ): Promise<string> => {
      if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
        value = JSON.stringify(value)
      }
      cachedParameters[context.stage] = null

      const parameter = await client.putParameter({
        Name: `/${context.stage}/global/${key}`,
        Value: value,
        Type: isSecure ? 'SecureString' : 'String',
        Overwrite: overwrite,
      })

      return parameter.$response.data as string
    },
  }
}
