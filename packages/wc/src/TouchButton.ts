import { css, WebComponent } from './WebComponent';

;

const styleSheet = css`
   :host {
      display: inline-block;
      box-sizing: border-box;
      width: fit-content;
      height: 100%;
      text-align: center;
   }

   div {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
   }

   div[disabled=true] {
      filter: opacity(0.5) grayscale(50%);
   }
`

/**
 * 限流按钮
 */
export class TouchButton extends HTMLElement implements WebComponent {
   delay = 400
   interval = 80

   static observedAttributes: string[] = ['delay']
   attributeChangedCallback(name: string, ov: any, nv: string) {
      if (name === 'delay') {
         this.delay = parseInt(nv) || 600
      } else if (name === 'interval') {
         this.interval = parseInt(nv) || 80
      }
   }

   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.innerHTML = `<div><slot></slot></div>`
      const div = shadow.querySelector('div')!
      let h: any = 0, i: any = 0
      const emit = () => {
         this.dispatchEvent(new CustomEvent('touch'))
      }
      const start = () => {
         if (!i) i = setInterval(emit, this.interval)
      }
      const clear = () => {
         clearTimeout(h)
         h = 0
         clearInterval(i)
         i = 0
      }
      div.addEventListener('mousedown', (e: Event) => {
         if (!h) h = setTimeout(start, this.delay)
      })
      div.addEventListener('mouseup', clear)
      div.addEventListener('mouseleave', clear)
      div.addEventListener('mouseout', clear)
      div.addEventListener('click', emit)
      shadow.adoptedStyleSheets.push(styleSheet)
   }

}

if (!customElements.get('touch-button'))
   customElements.define('touch-button', TouchButton)
