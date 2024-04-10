import { work } from "@/boot/worker"
import { useCtxMenuState } from "@/states/ctxMenu"
import { IniObjectRo, useMemo, useSingleton } from "@ra2inier/core"

export type CtxItem = {
   object: IniObjectRo,
   openHandle: () => void
}

export const useObjectCtxmenu = useMemo((mainKey: string) => {
   const ctxmenu = useCtxMenuState()
   return ctxmenu.useCtxMenu<CtxItem>({
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
})[0]
