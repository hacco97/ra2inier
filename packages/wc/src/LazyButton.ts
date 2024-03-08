import { css, html, WebComponent } from './WebComponent';

const styleSheet = css`
   :host {
      display: inline-block;
      box-sizing: border-box;
      width: fit-content;
      height: 100%;
      text-align: center;
   }

   div {
      height: 100%;
   }

   div[disabled=true] {
      filter: opacity(0.5) grayscale(50%);
   }
`

/**
 * 限流按钮
 */
export class LazyButton extends HTMLElement implements WebComponent {
   delay = 1.5
   #disabled = false

   static observedAttributes: string[] = ['delay']
   attributeChangedCallback(name: string, ov: any, nv: string) {
      if (name === 'delay') {
         this.delay = parseInt(nv) || 1.5
      }
   }

   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.innerHTML = html`<div><slot></slot></div>`
      const div = shadow.querySelector('div')!
      div.addEventListener('click', (e: Event) => {
         if (this.#disabled) return e.stopPropagation()
         else {
            this.#disabled = true
            div.setAttribute('disabled', 'true')
            setTimeout(() => {
               div.setAttribute('disabled', 'false')
               this.#disabled = false
            }, this.delay * 1000)
         }
      })
      shadow.adoptedStyleSheets.push(styleSheet)
   }

}

if (!customElements.get('lazy-button'))
customElements.define('lazy-button', LazyButton)
