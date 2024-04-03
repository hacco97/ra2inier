import { reactive, readonly } from "vue";
import { FootTabType, useFoottabState } from '@/states/footTabList'
import { defineStore } from "pinia";
import { useLayoutState } from "./layout";

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

export const useDialogState = defineStore('dialog-state', {
   state: () => {
      const dialogs: Dialog[] = reactive([])
      let nextID = 0

      const layout = useLayoutState()
      const foottab = useFoottabState()

      function addDialog(question: string, type = DialogType.askIf) {
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

      function ask(question: string, type: DialogType = DialogType.askIf, modal = true) {
         if (modal) {
            layout.footTabSize.max()
            foottab.selectFootTabByType(FootTabType.Dialog)
         }
         return addDialog(question, type).then((res) => {
            modal && layout.footTabSize.recover()
            return res
         })
      }

      return {
         list: readonly(dialogs),
         addDialog,
         ask
      }
   }
})

export type DialogState = ReturnType<typeof useDialogState>
