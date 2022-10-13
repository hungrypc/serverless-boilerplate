import mongoose from 'mongoose'

import { Context } from '@app/common'
import { ConfigManager } from '@app/config-manager'
import { merge } from '@app/lodash'
import { Logger } from '@app/logger'

type Args = {
  context: Context
  connectionOptions?: mongoose.ConnectOptions
}

const defaultConnectionOptions: mongoose.ConnectOptions = {
  maxPoolSize: 1,
  family: 4,
}

class MongoInstance {
  private static instance: mongoose.Mongoose

  private constructor() {}
  static async getInstance({ context, connectionOptions }: Args) {
    if (!MongoInstance.instance) {
      const logger = Logger(context)

      let url: string = await ConfigManager(context).get('MONGO_URL')
      url = url.replace('{stage}', context.stage).replace('{serviceName}', context.serviceName)

      logger.info(`Start initializing Mongo with url ${url}`)
      MongoInstance.instance = await mongoose.connect(url, merge({}, defaultConnectionOptions, connectionOptions))
      logger.info(`Successfully initialized Mongo`)
    }

    return MongoInstance.instance
  }
}

export interface MongoClient {
  client: mongoose.Mongoose
  disconnect: () => Promise<void>
  isConnected: () => boolean
  isConnecting: () => boolean
}

export const MongoClient = async (args: Args): Promise<MongoClient> => {
  const instance = await MongoInstance.getInstance(args)

  return {
    client: instance,
    disconnect: async (): Promise<void> => instance.disconnect(),
    isConnected: (): boolean => instance.connection.readyState === 1,
    isConnecting: (): boolean => instance.connection.readyState === 2,
  }
}
