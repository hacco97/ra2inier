

import { Config } from "@ra2inier/core";
import { BrowserWindow } from "electron";
import { mapping, controller, components, param ,inject} from "~/mainWindow/ioc.config";

@controller('debug')
export class Debug {

   @inject('app-config') declare config: Config

   @mapping('apis')
   getContainer() {
      const apis = []
      for (const skey in components) {
         const info = components[skey]
         for (const fkey in info.mapping) {
            apis.push(skey + '/' + fkey)
         }
      }
      return apis
   }

   @mapping('devtool')
   openDevtool(@param('window') win: BrowserWindow) {
      win.webContents.openDevTools()
   }

   @mapping('vuetool')
   openVuetool(@param('window') win: BrowserWindow) {
      win.webContents.session.loadExtension(this.config.VITE_VUE_DEVTOOLS)
   }
}
