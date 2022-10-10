export enum ConfigParams {
  MONGO_URL = 'MONGO_URL',
  JWT_SECRET_KEY = 'JWT_SECRET_KEY',
}

export const GlobalConfig = { ...ConfigParams }
export type Config = typeof GlobalConfig

export type ConfigValues = Record<keyof Config, string>
