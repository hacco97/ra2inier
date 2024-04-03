import { globalEvent } from "@/boot/event"
import { work } from "@/boot/worker"
import { useCtxMenuState } from "@/states/ctxMenu"
import { IniObjectRo } from "@ra2inier/core"
import { Directive } from "vue"


export type CtxItem = {
   object: IniObjectRo,
   openHandle: () => void
}

let objectCtx: Directive<HTMLElement, any> | undefined
// globalEvent.on('project-loaded', () => objectCtx = undefined)
export function useObjectCtxmenu() {
   const ctxmenu = useCtxMenuState()
   if (!objectCtx) objectCtx = ctxmenu.useCtxMenu<CtxItem>({
      '编辑对象'(item) {
         item.openHandle()
      },
      '翻译对象'(item) {
         console.log('dance')
         work('object/translate', { objectKey: item.object.key })
      },
      '删除对象'(item) {
         console.log(item)
      },
      '克隆对象'() { },
   })
   return objectCtx!
}
