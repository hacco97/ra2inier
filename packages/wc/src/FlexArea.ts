import { WebComponent } from './WebComponent'
import { css } from './cssUtils'
const styleSheet = css`
   :host {
      display: inline-block;
      box-sizing: border-box;
      width: fit-content;
      height: 100%;
      text-align: left;
      cursor: text;
      user-select: none;
   }

   div {
      position: relative;
      z-index: auto;
      width: 100%;
      height: 100%;
   }

   *::selection {
      color: var(--selection-color);
      background-color: var(--selection-background-color);
   }

   pre {
      margin: 0;
      width: 100%;
      height: 100%;
      outline: 0;
      min-width: fit-content;
      min-height: 1em;
      font: inherit;
      user-select: all;
   }

   pre::after {
      content: var(--flex-area-placeholder);
      position: absolute;
      z-index: auto;
      inset: 0;
   }

   span {
      display: block;
      height: 0;
      overflow: hidden;
   }
`

/**
 * 能够弹性伸缩的多行文本输入框
 */
export class FlexArea extends HTMLElement implements WebComponent {
   #pre: HTMLPreElement
   #span: HTMLElement
   #placeholder = ''

   get placeholder() { return this.#placeholder }
   set placeholder(val: string) {
      if (!val) return
      this.#placeholder = val
      this.#span.innerText = val
      this.updatePlaceholder()
   }

   updatePlaceholder() {
      const tmp = this.value === '' ? `'${this.#placeholder}'` : ''
      this.#pre.style.setProperty('--flex-area-placeholder', tmp)
   }

   get value() { return this.#pre.innerText }
   set value(val: string) {
      this.#pre.innerText = val
      this.updatePlaceholder()
   }

   set disabled(val: string) {
      this.setAttribute('disabled', val === 'true' ? 'true' : 'false')
      this.#pre.contentEditable = !val + ''
   }

   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true })
      shadow.innerHTML = `
      <div>
         <pre part="pre" contenteditable="true"></pre>
         <span></span>
      </div>
      `
      const pre = this.#pre = shadow.querySelector('pre')!
      this.#span = shadow.querySelector('span')!
      let memory = ''
      pre.addEventListener('input', (e) => this.updatePlaceholder())
      pre.addEventListener('keydown', (e: KeyboardEvent) => {
         if (e.key === 'Enter' && memory !== this.value) {
            memory = this.value
            this.dispatchEvent(new CustomEvent('change', { bubbles: false }))
         }
      })
      pre.addEventListener('blur', () => {
         this.updatePlaceholder()
         if (memory !== this.value) {
            memory = this.value
            this.dispatchEvent(new CustomEvent('change', { bubbles: false }))
         }
      })
      shadow.adoptedStyleSheets.push(styleSheet)
   }

   static observedAttributes = ["text", "disabled", "placeholder"]
   attributeChangedCallback(name: string, ov: string, nv: string) {
      if (name === 'text') {
         this.value = nv
      } else if (name === 'disabled') {
         this.disabled = nv
      } else if (name === 'placeholder') {
         this.placeholder = nv
      }
   }

   connectedCallback() {
      setTimeout(() => this.updatePlaceholder())
   }
}

if (!customElements.get('flex-area'))
   customElements.define('flex-area', FlexArea)
