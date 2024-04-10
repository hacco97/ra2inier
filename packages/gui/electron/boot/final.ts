// 程序后处理
import { app, dialog } from "electron"
import { useLogger } from "~/boot/logger"

const logger = useLogger('final-center')

const executes: Function[] = []

export function addQuitCallback(func: Function) {
   executes.push(func)
}

export function finalCallback() {
   if (process.platform !== 'darwin') {
      for (const func of executes) {
         try {
            func()
         } catch (_) { logger(_) }
      }
      executes.splice(0)
   }
}

app.on('will-quit', finalCallback)

process.on('uncaughtException', async (e) => {
   useLogger('uncaughtException')(e)
   finalCallback()
   const msg = '请联系开发者或尝试更新版本\n' + e.message + '\n' + e.stack
   setTimeout(() => dialog.showErrorBox('程序出bug啦', msg))
   // app.quit()
   return false
})


process.on('unhandledRejection', async (e) => {
   useLogger('unhandledRejection')(e)
   finalCallback()
   const msg = '请联系开发者或尝试更新版本\n' + e
   setTimeout(() => dialog.showErrorBox('程序出bug啦', msg))
   // app.quit()
   return false
})
