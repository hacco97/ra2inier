import { dialog } from "electron";
import { mapping, pathVar, controller } from "~/mainWindow/ioc.config";

@controller('dialog')
export class DialogServ {


   @mapping('open')
   async openDialog(@pathVar type: string) {
      const properties: any[] = ['openFile']
      switch (type) {
         case 'dir':
            properties.push('openDirectory')
         case 'dirs':
            properties.push('openDirectory', 'multiSelections')
         case 'files':
            properties.push('multiSelections')
      }
      const ret = await dialog.showOpenDialog({ properties })
      if (ret.canceled) throw Error('用户取消了操作')
      else return ret.filePaths
   }
}
