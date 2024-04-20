import { LogLevel, Logger } from "@ra2inier/core";
import { BrowserWindow } from "electron/main";


const LOGGER_CHANNEL = 'log-from-backend'

export class FrontLogger implements Logger {

   #window
   constructor(window: BrowserWindow) {
      this.#window = window
   }

   debug(msg: string, remark?: any): void {
      this.#window.webContents.send(LOGGER_CHANNEL, LogLevel.debug, msg, remark)
   }
   info(msg: string, remark?: any): void {
      this.#window.webContents.send(LOGGER_CHANNEL, LogLevel.info, msg, remark)
   }
   warn(msg: string, remark?: any): void {
      this.#window.webContents.send(LOGGER_CHANNEL, LogLevel.warn, msg, remark)
   }
   error(msg: string, remark?: any): void {
      this.#window.webContents.send(LOGGER_CHANNEL, LogLevel.error, msg, remark)
   }
}


const EMITTED_CHANNEL = 'event-from-backend'

export function createFrontEmitter(window: BrowserWindow) {
   return (channel: string, data: Record<string, any>) => {
      window.webContents.send(EMITTED_CHANNEL, 'backend::' + channel, data)
   }
}
