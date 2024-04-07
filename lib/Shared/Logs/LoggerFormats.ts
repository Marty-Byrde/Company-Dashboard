import { format } from 'logform'
import combine = format.combine
import colorize = format.colorize
import printf = format.printf
import padLevels = format.padLevels

export const FILE_FORMAT = combine(
  padLevels(),
  printf(({ level, message, label }) => {
    const date = new Date(Date.now())

    const timestamp =
      date
        .toLocaleDateString('de')
        .split('.')
        .map((seg) => (seg.length >= 2 ? seg : '0' + seg))
        .join('.') +
      ' ' +
      date.toLocaleTimeString('de')

    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`
  }),
)

export const CONSOLE_FORMAT = combine(
  colorize(),
  printf(({ level, message, label, timestamp }) => {
    return `[${level}]: ${message}`
  }),
)
