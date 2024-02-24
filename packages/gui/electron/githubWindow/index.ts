import { escapePath } from "@ra2inier/core/node";
import { addWindow } from "~/windows";

export function createGithubWindow() {
   const win = addWindow('github', {
      webPreferences: {
         nodeIntegration: false,
         contextIsolation: true,
         sandbox: true,
         preload: escapePath(__dirname, './safePreload.js')
      }
   })

   win.loadURL('https://github.com')
   return win
}
