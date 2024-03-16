import { globalEvent } from "@/boot/event"
import { work } from "@/boot/worker"
import { useCtxMenu } from "@/states/ctxMenu"
import { IniObjectRo } from "@ra2inier/core"
import { Directive } from "vue"


export type CtxItem = {
   object: IniObjectRo,
   openHandle: () => void
}

let vCtxmenu: Directive<HTMLElement, any> | undefined

globalEvent.on('project-loaded', () => vCtxmenu = undefined)

export function useObjectCtxmenu() {
   if (!vCtxmenu) vCtxmenu = useCtxMenu<CtxItem>({
      '编辑'(item) {
         item.openHandle()
      },
      '翻译'(item) {
         console.log('dance')
         work('object/translate', { objectKey: item.object.key })
      },
      '删除'(item) {
         console.log(item)
      },
      '复制'() { },
      '粘贴'() { },
   })
   return vCtxmenu!
}

