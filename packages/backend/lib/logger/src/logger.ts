import { Context as BaseContext } from '@app/common'

export enum LogLevel {
  Trace = 'T',
  Debug = 'D',
  Info = 'I',
  Warning = 'W',
  Error = 'E',
  Fatal = 'F',
  Silent = 'S',
}

type Context = BaseContext & {
  config?: {
    logLevel?: LogLevel
  }
}

type Metadata = unknown

const mapping: { [key in LogLevel]: number } = {
  [LogLevel.Trace]: 100,
  [LogLevel.Debug]: 200,
  [LogLevel.Info]: 300,
  [LogLevel.Warning]: 400,
  [LogLevel.Error]: 500,
  [LogLevel.Fatal]: 600,
  [LogLevel.Silent]: -1,
}

export function Logger(context: Context) {
  const isTest = process.env?.NODE_ENV === 'test'
  const loggerLevel: LogLevel = context?.config?.logLevel || (isTest ? LogLevel.Silent : LogLevel.Info)

  const sanitizeMetadata = (metadata: Metadata) => {
    return JSON.stringify(metadata)
  }

  const sanitizeMessage = (message: string) => {
    return message
  }

  const format = (message: string, metadata: Metadata, level: LogLevel): string => {
    return `[${new Date().toISOString()}] [${context.serviceName}] [${context.stage}] [${
      context.correlatedRequestId
    }] [${level.toUpperCase()[0]}] [${sanitizeMessage(message)}] [${sanitizeMetadata(metadata)}]`
  }

  const log = (message: string, metadata: Metadata, level: LogLevel): void => {
    if (loggerLevel === LogLevel.Silent || mapping[level] < mapping[loggerLevel]) {
      return
    }

    let logMethod = console.log

    switch (level) {
      case LogLevel.Error:
      case LogLevel.Fatal:
        logMethod = console.error
        break
      case LogLevel.Warning:
        logMethod = console.warn
        break
      case LogLevel.Info:
        logMethod = console.info
        break
      case LogLevel.Debug:
        logMethod = console.debug
        break
      case LogLevel.Trace:
        logMethod = console.trace
        break
    }

    logMethod(format(message, metadata, level))
  }

  return {
    trace(message: string, metadata: Metadata = {}): void {
      log(message, metadata, LogLevel.Trace)
    },
    debug(message: string, metadata: Metadata = {}): void {
      log(message, metadata, LogLevel.Debug)
    },
    info(message: string, metadata: Metadata = {}): void {
      log(message, metadata, LogLevel.Info)
    },
    warning(message: string, metadata: Metadata = {}): void {
      log(message, metadata, LogLevel.Warning)
    },
    error(message: string, metadata: Metadata = {}): void {
      log(message, metadata, LogLevel.Error)
    },
    fatal(message: string, metadata: Metadata = {}): void {
      log(message, metadata, LogLevel.Fatal)
    },
  }
}

export type Logger = ReturnType<typeof Logger>
