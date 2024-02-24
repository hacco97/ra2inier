
/**
 * 日志等级
 */
export enum LogLevel {
   debug = "debug",
   info = 'info',
   warn = 'warn',
   error = 'error',
}

export interface Logger {
   debug(msg: string, remark?: any): void,
   info(msg: string, remark?: any): void,
   warn(msg: string, remark?: any): void,
   error(msg: string, remark?: any): void
}

/**
 * 日志信息
 */
export interface Message {
   id: number,
   content: string,
   time: string,
   remark?: any,
   read?: boolean,
   sender: string,
   level: LogLevel
}

