import { Directive, ref } from 'vue';

export function useFocus() {
   const current = ref(-1)
   const map = new Map<number, HTMLElement>()

   function registerFocusElement(el: HTMLElement, binding: { value: number }) {
      map.set(binding.value, el)
   }

   function updateFocusElement(el: HTMLElement, binding: { value: number }) {
      map.set(binding.value, el)
   }

   function unRegisterFocusElement(el: HTMLElement, binding: { value: number }) {
      map.delete(binding.value)
   }

   function focusAt(order: number) {
      setTimeout(() => {
         map.get(order)?.focus()
         current.value = order
      }, 10)
   }

   function focusNext(step = 1) {
      focusAt((current.value += step) % map.size)
   }

   function focusPrev(step = 1) {
      focusAt(((current.value -= step) + map.size) % map.size)
   }

   function focusCurrent() {
      focusAt(current.value)
   }

   function setCurrent(focusID: number) {
      current.value = focusID
   }

   function deleteFocus() {
      map.delete(map.size - 1)
   }

   function focusLast() {
      focusAt(map.size - 1)
   }

   const directive: Directive<HTMLElement, number> = {
      mounted: registerFocusElement,
      updated: updateFocusElement,
      unmounted: unRegisterFocusElement
   }

   function blur() {
      map.get(current.value)?.blur()
   }

   return {
      map,
      current,
      directive,
      focusAt,
      focusNext,
      focusPrev,
      focusCurrent,
      focusLast,
      setCurrent,
      deleteFocus,
      blur
   }
}

export type Focus = ReturnType<typeof useFocus>
