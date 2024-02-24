import { ref } from "vue"

export function useScroller() {
   //横向滚动条逻辑
   let scroller: HTMLElement
   const subLeft = ref('0px')
   function scrolled() {
      subLeft.value = -scroller?.scrollLeft + 'px'
   }

   function makeScrollxer(el: HTMLElement) {
      scroller = el
      el.addEventListener('wheel', (e: WheelEvent) => {
         if (e.deltaY > 0) {
            el.scrollBy(25, 0)
         } else {
            el.scrollBy(-25, 0)
         }
      })
   }
   return {
      makeScrollxer,
      subLeft,
      scrolled
   }
}
