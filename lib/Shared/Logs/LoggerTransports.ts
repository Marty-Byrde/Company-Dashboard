import { LoggingLevels } from '@/lib/Shared/Logs/Logger'
import * as winston from 'winston'
import { format } from 'winston'
import LevelOnlyFormat from '@/lib/Shared/Logs/LevelOnlyFormat'
import { FILE_FORMAT } from '@/lib/Shared/Logs/LoggerFormats'
import combine = format.combine

export function createFileTransport(level: LoggingLevels, options?: { dir?: string; overrideFileName?: string; levelOnly?: boolean; disabled?: boolean }) {
  let { dir, overrideFileName, levelOnly, disabled } = options ?? {}

  if (dir?.startsWith('/')) dir = dir.substring(1)
  if (dir && !dir.endsWith('/')) dir = dir + '/'

  return new winston.transports.File({
    filename: `./${dir}${overrideFileName ?? level}.log`,
    level,
    format: levelOnly ? combine(FILE_FORMAT, LevelOnlyFormat(level)) : FILE_FORMAT,
    silent: disabled,
  })
}
