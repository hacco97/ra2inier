import { Directive, computed, reactive, readonly, ref } from 'vue';

import { forIn } from '@ra2inier/core';
import { defineStore } from 'pinia';


class CtxMemuItem {
   static nextId = 0

   id: number = CtxMemuItem.nextId++
   label: string = ''
   enabled: boolean = false
   data: any
   declare callback: () => void

   constructor(label: string, cb: () => void) {
      this.label = label
      this.callback = cb
   }
}

export type CtxCallback<T extends any> = (data: T, el: HTMLElement) => void

const createCtxMenuState = () => {
   // 右键菜单逻辑
   const isCtxMenuShowed = ref(false)
   const ctxMenuPostion = reactive({ translate: `100px 100px` })

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

   function useCtxMenu<T extends any>(ctxMenuMap: Record<string, CtxCallback<T>>) {
      const itemList: CtxMemuItem[] = []
      const itemIdList = new Set<number>()

      /**
       * 让一个指令可以被应用于多个不同的元素，记录不同的元素的指令参数
       * 元素：指令参数
       */
      const elMap = new Map<HTMLElement, any>()
      let target: HTMLElement
      forIn(ctxMenuMap, (key, cb) => {
         if (typeof cb !== 'function') return
         const tmp = new CtxMemuItem(key, () => {
            cb(elMap.get(target), target)
         })
         itemIdList.add(tmp.id)
         ctxMemuItems.push(tmp)
         itemList.push(tmp)
      })


      return <Directive<HTMLElement, any>>{
         mounted(el, { value }) {
            elMap.set(el, value)
            el.addEventListener('contextmenu', (ev) => {
               for (const item of itemList) {
                  item.enabled = true
                  item.data = value
               }
               target = el
            })
         },
         updated(el, { value }) {
            elMap.set(el, value)
         },
         // unmounted(el) {
         //    elMap.delete(el)
         //    if (elMap.size) return
         //    for (let id = 0; id < ctxMemuItems.length; id++) {
         //       const item = ctxMemuItems[id];
         //       if (itemIdList.has(item.id)) ctxMemuItems.splice(id--, 1)
         //    }
         // }
      }
   }

   return {
      isCtxMenuShowed: computed(() => isCtxMenuShowed.value),
      ctxMemuItems: readonly(ctxMemuItems),
      ctxMenuPostion: readonly(ctxMenuPostion),
      vCtxmenu,
      vCtxRoot,
      closeCtxMenu,
      openCtxMenu,
      /**
       * 普通元素注册右键菜单
       */
      useCtxMenu,
   }
}

/**
 * 真单例
 */
export const useCtxMenuState = defineStore('ctxmenu-store', { state: createCtxMenuState })

export type CtxmenuState = ReturnType<typeof useCtxMenuState>
