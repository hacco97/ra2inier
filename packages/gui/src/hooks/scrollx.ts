

export function makeScrollxer(el: HTMLElement) {
   el.addEventListener('wheel', (e: WheelEvent) => {
      if (e.deltaY > 0) {
         el.scrollBy(25, 0)
      } else {
         el.scrollBy(-25, 0)
      }
   }, { passive: false })
}

export function makeStickScrollxer(el: HTMLElement) {

   el.addEventListener('wheel', (e: WheelEvent) => {
      const target = e.currentTarget as HTMLElement
      if (e.deltaY > 0) {
         el.scrollBy(25, 0)
         if (target.scrollLeft - target.scrollWidth + target.clientWidth > -5) return
      } else {
         el.scrollBy(-25, 0)
         if (target.scrollLeft === 0) return
      }
      e.preventDefault()
   }, { passive: false })
}
