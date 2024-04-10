import { inject, mapping, param, controller, pathVar, final } from "~/mainWindow/ioc.config";
import { ClientConfig, Config, forIn, toRaw } from "@ra2inier/core";
import { forDir, readFile, writeFile, removeFile } from "@ra2inier/core/node";
import { resolve } from "node:path";

const _map = new ClientConfig

const SAVE_BATCH_COUNT = 8

@controller('config')
export class ConfigServ {
   @inject('app-config') declare appConfig: Config

   @mapping('client')
   getClientConfig() {
      return this.appConfig.getClientConfig()
   }

   @mapping('app')
   getAppConfig() {
      return toRaw(this.appConfig)
   }

   @mapping('save')
   saveClientConfig() {
      this.appConfig.saveConfig()
      return true
   }

   #c1 = 0
   @mapping('set')
   setConfigByKey(@param('key') key: string, @param('value') val: string) {
      if (key in _map && val) {
         this.appConfig.setByKey(key, val)
         if (++this.#c1 > SAVE_BATCH_COUNT) {
            this.appConfig.saveConfig()
            this.#c1 = 0
         }
         return true
      } else throw Error('键值不合法')
   }

   @mapping('get')
   getConfigByKey(@pathVar key: string) {
      const val = this.appConfig[key]
      if (typeof val !== 'function') return val
      return void 0
   }

   @mapping('themes')
   getThemeList() {
      const map: Record<string, string> = {}
      forDir(this.appConfig.THEME_DIR, (path, dirent) => {
         const name = dirent.name.split('.css')[0]
         if (name) map[name] = readFile(path)
      })
      return map
   }

   countForTheme: Record<string, string> = {}
   #c2 = 0
   @mapping('save-theme')
   saveTheme(@param('name') name: string, @param('text') text: string) {
      if (!name) return false
      this.countForTheme[name] = text
      if (this.#c2++ > SAVE_BATCH_COUNT) {
         this.doSaveTheme()
         this.#c2 = 0
      }
      return true
   }

   @final
   doSaveTheme() {
      forIn(this.countForTheme, (name, text) => {
         if (!name) return
         const path = resolve(this.appConfig.THEME_DIR, name + '.css')
         if (text) writeFile(path, text)
         else removeFile(path)
      })
   }
}
