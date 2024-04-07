import { format } from 'winston'
import { LoggingLevels } from '@/lib/Shared/Logs/Logger'

export default function LevelOnlyFormat(level: LoggingLevels) {
  const filter = format((log) => {
    return log.level === level ? log : false
  })

  return filter()
}
