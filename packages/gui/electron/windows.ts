import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

import config from './boot/config';
import { addQuitCallback } from './boot/final';

/**
 * windows集中管理模块，控制建立的全部窗口
 */

// window name：window instance
export const windows: Record<string, BrowserWindow> = {}

export function addWindow(name: string, options?: BrowserWindowConstructorOptions) {
   if (windows[name]) return windows[name]
   return windows[name] = new BrowserWindow(options)
}

export function getWindowByName(name: string): BrowserWindow | undefined {
   return windows[name]
}

export function deleteWindowByName(name: string) {
   windows[name].close()
   delete windows[name]
}

export function deleteAllWindows() {
   for (const key in windows) {
      windows[key] ?? windows[key].close()
      delete windows[key]
   }
}

export function getMainWindow(): BrowserWindow | undefined {
   return windows[config.MAIN_WINDOW_NAME]
}

addQuitCallback(deleteAllWindows)
