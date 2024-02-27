import { css } from './cssUtils';
import { WebComponent } from './WebComponent';

export const styleSheet = css`
   :host {
      display: inline-block;
      box-sizing: border-box;
      width: fit-content;
      height: 100%;
      text-align: center;
      overflow: hidden;
      cursor: text;
   }

   div {
      display: inline-block;
      position: relative;
      z-index: 0;
      width: 100%;
      height: 100%;
      text-decoration: inherit;
   }

   span {
      display: block;
      width: fit-content;
      height: 100%;
      white-space: pre;
      visibility: hidden;
   }

   input {
      all: unset;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      text-decoration: inherit;
   }
`

/**
 * 能够弹性伸缩的单行文本输入框
 */
export class FlexInput extends HTMLElement implements WebComponent {
   #span: HTMLSpanElement
   #input: HTMLInputElement
   get value() {
      return this.#input.value
      // return this.#input.value
   }
   set value(val: string) {
      this.#input.value = val
      this.#span.textContent = val
   }

   set disabled(val: boolean) {
      this.setAttribute('disabled', val ? 'true' : 'false')
      this.#input.disabled = !!val
   }

   get textContent() { return this.#input.value }

   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true })
      shadow.innerHTML = `
      <div>
         <span part="span"></span>
         <input type="text" part="input" />
      </div>
      `
      const input = this.#input = shadow.querySelector('input')!
      this.#span = shadow.querySelector('span')!
      input.addEventListener('input', () => { this.checkPlaceholder() })
      input.addEventListener('change', () => {
         this.change()
         this.checkPlaceholder()
      })
      shadow.adoptedStyleSheets.push(styleSheet)
   }

   change() {
      this.dispatchEvent(new CustomEvent('change', { bubbles: false, detail: this.value }))
   }

   checkPlaceholder() {
      if (!this.#input.value)
         this.#span.textContent = this.#input.placeholder
      else this.#span.textContent = this.#input.value
   }

   connectedCallback() {
      setTimeout(() => this.checkPlaceholder())
   }

   static observedAttributes = ["text", 'placeholder']
   attributeChangedCallback(name: string, ov: string, nv: string) {
      if (name === 'text') {
         this.value = nv
      } else if (name === 'placeholder') {
         this.#input.placeholder = nv
      }
   }
}


if (!customElements.get('flex-input'))
   customElements.define('flex-input', FlexInput)
