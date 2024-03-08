import { css, WebComponent } from './WebComponent';

;

const styleSheet = css`
   :host {
      display: inline-block;
      box-sizing: border-box;
   }

   div {
      height: 100%;
      color: inherit;
      background-color: currentColor;
      mask-size: cover;
   }
`

/**
 * 能够改变颜色的svg图标，并且不使用内联的样式
 */
export class svgIcon extends HTMLElement implements WebComponent {
   #div: HTMLElement

   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.innerHTML = `<div></div>`
      this.#div = shadow.querySelector('div')!
      shadow.adoptedStyleSheets.push(styleSheet)
   }

   static observedAttributes = ["src"]
   attributeChangedCallback(name: string, ov: string, nv: string) {
      if (name === 'src') {
         this.#div.style.setProperty('mask-image', `url(${nv})`)
      }
   }
}

if (!customElements.get('svg-icon'))
   customElements.define('svg-icon', svgIcon)
