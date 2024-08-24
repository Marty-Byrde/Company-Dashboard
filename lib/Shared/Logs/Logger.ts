'use server'
import * as winston from 'winston'
import { createLogger } from 'winston'
import { CONSOLE_FORMAT } from '@/lib/Shared/Logs/LoggerFormats'
import { existsSync, mkdirSync } from 'node:fs'
import { createFileTransport } from '@/lib/Shared/Logs/LoggerTransports'
import env from '@/lib/root/Environment'

const isSilent = env.WINSTON_SILENT.toLowerCase().trim() === 'true'

// Create the logs directory if it doesn't exist
existsSync('./logs') || mkdirSync('./logs')

const logger = createLogger({
  handleExceptions: true,
  exitOnError: false,
  transports: [
    createFileTransport('error', { dir: 'logs', disabled: isSilent, levelOnly: true }),
    createFileTransport('warn', { dir: 'logs', disabled: isSilent, levelOnly: true }),
    createFileTransport('info', { dir: 'logs', disabled: isSilent, levelOnly: true }),
    createFileTransport('debug', { dir: 'logs', disabled: isSilent, levelOnly: true }),
    createFileTransport('verbose', { dir: 'logs', disabled: isSilent, levelOnly: true }),
    createFileTransport('silly', { dir: 'logs', disabled: isSilent, overrideFileName: 'logs' }),

    new winston.transports.Console({ format: CONSOLE_FORMAT, level: 'silly' }),
  ],
})

export type LoggingLevels = 'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly'

interface LoggingProps {
  message: string | number | object
  args: any
}

async function logMessage(level: LoggingLevels, message: LoggingProps['message'], args?: any) {
  /** Simplifies the message and the args to be logged
   *  In case the message is an object, it will be stringified
   *  Each arg that is no object will be added with a space to the message
   *  Each arg that is an object will be stringified and added with a new line before and after
   * */
  const simplfyMessage = () => {
    if (typeof message === 'object') message = '\n' + JSON.stringify(message, null, 2)
    if (args && args.length > 0) {
      message += ' ' // Add a space between the message and the args
      args.forEach((arg: any) => (typeof arg === 'object' ? (message += `\n${JSON.stringify(arg, null, 2)}\n`) : (message += arg.toString() + ' ')))
    }
    return message.toString()
  }

  // @ts-ignore
  logger[level](simplfyMessage())
}

/** Logs a given message with the level 'error' using winston
 *  @description Works both on the client and server side.
 *  Note, when used on the client side, the log-functions cannot be called when the component is initially rendered. Thus, must be called in useEffect or other functions.
 *  @param message - The message to be logged, can be a string, number or object
 *  @param args - Additional arguments to be logged, which can be again strings, numbers or objects
 */
export const logError = async (message: LoggingProps['message'], ...args: LoggingProps['args']) => logMessage('error', message, args)

/** Logs a given message with the level 'warn' using winston
 *  @description Works both on the client and server side
 *  Note, when used on the client side, the log-functions cannot be called when the component is initially rendered. Thus, must be called in useEffect or other functions.
 *  @param message - The message to be logged, can be a string, number or object
 *  @param args - Additional arguments to be logged, which can be again strings, numbers or objects
 */
export const logWarning = async (message: LoggingProps['message'], ...args: LoggingProps['args']) => logMessage('warn', message, args)

/** Logs a given message with the level 'info' using winston
 *  @description Works both on the client and server side
 *  Note, when used on the client side, the log-functions cannot be called when the component is initially rendered. Thus, must be called in useEffect or other functions.
 *  @param message - The message to be logged, can be a string, number or object
 *  @param args - Additional arguments to be logged, which can be again strings, numbers or objects
 */
export const logInfo = async (message: LoggingProps['message'], ...args: LoggingProps['args']) => logMessage('info', message, args)

/** Logs a given message with the level 'debug' using winston
 *  @description Works both on the client and server side
 *  Note, when used on the client side, the log-functions cannot be called when the component is initially rendered. Thus, must be called in useEffect or other functions.
 *  @param message - The message to be logged, can be a string, number or object
 *  @param args - Additional arguments to be logged, which can be again strings, numbers or objects
 */
export const logDebug = async (message: LoggingProps['message'], ...args: LoggingProps['args']) => logMessage('debug', message, args)

/** Logs a given message with the level 'verbose' using winston
 *  @description Works both on the client and server side
 *  Note, when used on the client side, the log-functions cannot be called when the component is initially rendered. Thus, must be called in useEffect or other functions.
 *  @param message - The message to be logged, can be a string, number or object
 *  @param args - Additional arguments to be logged, which can be again strings, numbers or objects
 */
export const logVerbose = async (message: LoggingProps['message'], ...args: LoggingProps['args']) => logMessage('verbose', message, args)

logInfo(`Winston Transports have been ${isSilent ? 'disabled' : 'enabled'}`)
