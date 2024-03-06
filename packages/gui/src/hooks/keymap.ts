import { Directive } from 'vue';

export type KeyMapCallback = (this: HTMLElement, e: KeyboardEvent, val: any) => any

export interface KeyMap {
   [callback: string]: KeyMapCallback | KeyMapCallback[],
}

interface KeymapOptions {
   prevent?: boolean,
   stop?: boolean,
   tabindex?: number
}

const defaultOptions = {
   prevent: false,
   stop: false,
   tabindex: -1
}

export function useKeyMap(keymap: KeyMap, options?: KeymapOptions) {
   // const vm = new WeakMap<HTMLElement, KeyMap>()
   const vmData = new WeakMap<HTMLElement, any>()
   const f = (key: any) => key
   const customOptions = { ...defaultOptions, ...options }

   function map(e: KeyboardEvent) {
      const el = <HTMLElement>e.target
      // const keymap = <KeyMap>vm.get(el)
      customOptions.stop && e.stopPropagation()
      if (!keymap) return
      const keys = [
         e.ctrlKey && 'ctrl',
         e.shiftKey && 'shift',
         e.altKey && 'alt',
         e.key
      ].filter(f)
      const key = keys.join('+').toLowerCase()
      if (!keymap[key]) return
      const prevent = customOptions.prevent
      const tmp = keymap[key]
      if (tmp instanceof Array) {
         tmp.forEach(cb => {
            if (cb.call(el, e, vmData.get(el)) !== false)
               prevent && e.preventDefault()
         })
      }
      else {
         if (tmp.call(el, e, vmData.get(el)) !== false)
            prevent && e.preventDefault()
      }
   }

   function makeKeymap(el: HTMLElement, binding: { value: KeyMap }) {
      // vm.set(el, keymap)
      vmData.set(el, binding.value)
      if (el.getAttribute('tabindex') === null)
         el.setAttribute('tabindex', customOptions.tabindex + '')
      el.addEventListener('keydown', map)
   }

   function removeEffect(el: HTMLElement, binding: { value: KeyMap }) {
      el.removeEventListener('keydown', map)
   }

   function updateData(el: HTMLElement, binding: { value: any }) {
      vmData.set(el, binding.value)
   }

   return <Directive<HTMLElement, any>>{
      mounted: makeKeymap,
      unmounted: removeEffect,
      updated: updateData,
   }
}
