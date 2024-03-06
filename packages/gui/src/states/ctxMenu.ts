import { Directive, reactive, ref } from 'vue';

import { forIn } from '@ra2inier/core';

// 右键菜单逻辑
export const contextIsShowed = ref(false)
export enum ContextmenuType {
   Global,
   Package,
   Object,
   Inline,
   Word,
   Scope,
   Mapper
}
export const contextmenuType = ref(ContextmenuType.Global)
export const size = {
   width: 100,
   height: 200
}
export const position = reactive({
   top: '100px',
   left: '100px'
})

export async function showContextMenu(e: MouseEvent, type: number) {
   contextmenuType.value = type
   contextIsShowed.value = true
   const width = window.innerWidth, height = window.innerHeight
   if (height - e.pageY < size.height) position.top = height - size.height - 20 + 'px'
   else position.top = e.pageY - 20 + 'px'
   if (width - e.pageX < size.width) position.left = width - size.width - 20 + 'px'
   else position.left = e.pageX - 20 + 'px'
   e.stopPropagation()
}

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
   declare callback: Function

   constructor(label: string, cb: Function) {
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
const ctxMemuItems = reactive<CtxMemuItem[]>([
   new CtxMemuItem('item1', function (this: CtxMemuItem, data: any) { console.log(this.label, data) })
])

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

/**
 * 普通元素注册右键菜单
 */
export function useCtxMenu(ctxMenuMap: Record<string, Function>) {
   const thisList: CtxMemuItem[] = []
   const elMap = new Map<HTMLElement, any>()
   const idSet = new Set<number>()
   let target: HTMLElement
   forIn(ctxMenuMap, (key, cb) => {
      if (typeof cb !== 'function') return
      const tmp = new CtxMemuItem(key, () => {
         cb(elMap.get(target))
      })
      idSet.add(tmp.id)
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
      unmounted() {
         for (let id = 0; id < ctxMemuItems.length; id++) {
            const item = ctxMemuItems[id];
            if (idSet.has(item.id)) ctxMemuItems.splice(id--, 1)
         }
      }
   }
}

