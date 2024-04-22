import fs from 'node:fs';

import { date, dateTime } from '@ra2inier/core';

import config from './config';

/**
 *  日志模块
 */
export function useLogger(sender: string) {

   return function (e: any) {
      const tmp: any[] = []
      tmp.push(`[${dateTime()}] from: ${sender}`)
      tmp.push(e.command)
      tmp.push(e.stack || e.message || e)
      const msg = tmp.filter(Boolean).join('\n') + '\n\n'
      fs.appendFileSync(`${config.LOG_FILE_DIR}/${date()}.log`, msg, 'utf-8')
   }
}
