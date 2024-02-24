import fs from 'node:fs';

import { date } from '@ra2inier/core';

import config from './config';

/**
 *  日志模块
 */
export function useLogger(sender: string) {

   return function (e: any) {
      const stack = e.stack ? '\n' + e.stack : ''
      fs.appendFile(`${config.LOG_FILE_DIR}/${date()}.log`,
         `${date()} from ${sender}\n${e}${stack}\n\n`, { encoding: 'utf-8' }, () => { })
   }
}
