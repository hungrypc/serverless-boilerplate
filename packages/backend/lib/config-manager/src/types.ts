import { Config } from '@app/global-config'

type ParameterType = 'String' | 'SecureString' | 'StringList' | string
export type ConfigElement = keyof Config

export interface Parameter {
  value: string | undefined
  from: string
  type: ParameterType | undefined
}

export interface Parameters {
  [key: string]: Parameter
}

export type Context = {
  serviceName: string
  stage: string
  silent?: boolean
  config?: {
    environmentVariables?: {
      [key: string]: Parameter | string
    }
  }
}
