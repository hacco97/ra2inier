import { reactive } from "vue";
import { footTabSize } from '@/states/layout'
import { FootTabType, useFootSelect } from '@/states/footTabList'

export enum DialogType {
   askIf,
   askStr,
   askFile
}

export interface Dialog {
   id: number
   callback: Function,
   question: string,
   type: DialogType,
   res: any
}

export const dialogs: Dialog[] = reactive([])
let nextID = 0

export function addDialog(question: string, type = DialogType.askIf) {
   let rejectHandler: Function
   const p: Promise<any> = new Promise((solve) => {
      rejectHandler = () => solve(undefined)
      dialogs.push({
         callback(res: any) {
            solve(res)
            const id = dialogs.findIndex(val => val.id === this.id)
            dialogs.splice(id, 1)
         },
         question,
         id: nextID++,
         type,
         res: ''
      })
   })
   setTimeout(rejectHandler!, 10_000)
   return p
}

const { selectByType } = useFootSelect()

export function ask(question: string, type: DialogType = DialogType.askIf, modal = true) {
   if (modal) {
      footTabSize.max()
      selectByType(FootTabType.Dialog)
   }
   return addDialog(question, type).then((res) => {
      modal && footTabSize.recover()
      return res
   })
}
