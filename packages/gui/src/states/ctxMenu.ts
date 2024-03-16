import { Directive, reactive, ref } from 'vue';

import { forIn } from '@ra2inier/core';

// 右键菜单逻辑
const isCtxMenuShowed = ref(false)
const ctxMenuPostion = reactive({
   translate: `100px 100px`
})

let nextId = 0
class CtxMemuItem {
   id: number = nextId++
   label: string = ''
   enabled: boolean = false
   data: any
   declare callback: () => void

   constructor(label: string, cb: () => void) {
      this.label = label
      this.callback = cb
   }
}

function closeCtxMenu() {
   for (const item of ctxMemuItems) {
      item.enabled = false
   }
   isCtxMenuShowed.value = false
}

function openCtxMenu(ev: MouseEvent) {
   ctxMenuPostion.translate = `${ev.clientX}px ${ev.clientY}px`
   isCtxMenuShowed.value = true
   setTimeout(() => ctxMenu?.focus(), 16)
}

let ctxMenu: HTMLElement
const vCtxmenu = <Directive<HTMLElement>>{
   mounted(el) {
      ctxMenu = el
      el.tabIndex = -1
      el.addEventListener('click', closeCtxMenu)
      el.addEventListener('blur', closeCtxMenu)
      el.addEventListener('mousemove', () => el?.focus())
   }
}
const ctxMemuItems = reactive<CtxMemuItem[]>([])

const vCtxRoot = <Directive<HTMLElement>>{
   mounted(el) {
      el.addEventListener('contextmenu', openCtxMenu)
   }
}

/**
 * 右键菜单属性管理
 */
export function useCtxMenuInfo() {
   return {
      isCtxMenuShowed,
      ctxMemuItems,
      ctxMenuPostion,
      closeCtxMenu,
      openCtxMenu,
      vCtxmenu,
      vCtxRoot
   }
}

export type CtxCallback<T extends any> = (data: T, el?: HTMLElement) => void

/**
 * 普通元素注册右键菜单
 */
export function useCtxMenu<T extends any>(ctxMenuMap: Record<string, CtxCallback<T>>) {
   const thisList: CtxMemuItem[] = []
   const elMap = new Map<HTMLElement, any>()
   const ctxItemIdSet = new Set<number>()
   let target: HTMLElement
   forIn(ctxMenuMap, (key, cb) => {
      if (typeof cb !== 'function') return
      const tmp = new CtxMemuItem(key, () => {
         cb(elMap.get(target), target)
      })
      ctxItemIdSet.add(tmp.id)
      ctxMemuItems.push(tmp)
      thisList.push(tmp)
   })


   return <Directive<HTMLElement, any>>{
      mounted(el, { value }) {
         elMap.set(el, value)
         el.addEventListener('contextmenu', (ev) => {
            for (const item of thisList) {
               item.enabled = true
               item.data = value
            }
            target = el
         })
      },
      updated(el, { value }) {
         elMap.set(el, value)
      },
      unmounted(el) {
         elMap.delete(el)
         if (elMap.size) return
         for (let id = 0; id < ctxMemuItems.length; id++) {
            const item = ctxMemuItems[id];
            if (ctxItemIdSet.has(item.id)) ctxMemuItems.splice(id--, 1)
         }
      }
   }
}

