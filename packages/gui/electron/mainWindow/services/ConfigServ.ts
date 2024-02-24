import { inject, mapping, param, controller } from "~/mainWindow/ioc.config";
import { Config, toRaw } from "@ra2inier/core";


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
      return '保存成功'
   }

   @mapping('set')
   setConfigByKey(@param('key') key: string, @param('value') val: string) {
      if (key in this.appConfig.getClientConfig() && val) {
         this.appConfig.setByKey(key, val)
         this.appConfig.saveConfig()
         return '修改成功'
      } else throw Error('键值不合法')
   }

}
