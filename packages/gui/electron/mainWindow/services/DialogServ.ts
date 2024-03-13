import { BrowserWindow, dialog } from 'electron';
import { controller, mapping, param, pathVar, inject } from '~/mainWindow/ioc.config';

const TYPE_MAP: Record<string, any[]> = {
   dir: ['openDirectory'],
   dirs: ['openDirectory', 'multiSelections'],
   files: ['openFile', 'multiSelections'],
   file: ['openFile']
}

@controller('dialog')
export class DialogServ {

   @inject('window') declare window: BrowserWindow


   @mapping('open')
   async openDialog(@pathVar type: string, @param('modal') isModal: boolean) {
      const properties = TYPE_MAP[type] || TYPE_MAP.file
      let ret: Electron.OpenDialogReturnValue
      if (isModal) ret = await dialog.showOpenDialog(this.window, { properties })
      else ret = await dialog.showOpenDialog({ properties })
      if (ret.canceled) throw Error('用户取消了操作')
      else return ret.filePaths.map(p => p.replaceAll('\\', '/'))
   }
}
