import { DirectiveBinding } from "vue";

export function makeSvgIcon(el: HTMLElement, binding: DirectiveBinding<string>) {
   el.classList.add('svg-icon')
   const padding = el.getAttribute('padding') || '10%'
   el.innerHTML = `<div style="padding: ${padding};">${binding.value}</div>`
}
