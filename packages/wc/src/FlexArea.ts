import { css } from './cssUtils';
import { WebComponent } from './WebComponent';

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

   *::selection {
      color: var(--selection-color);
      background-color: var(--selection-background-color);
   }

   div {
      position: relative;
   }

   p {
      width: 2px;
      height: 100%;
      margin: 0;
      visibility: hidden;
   }

   textarea {
      all: unset;
      position: absolute;
      margin: 0;
      height: 100%;
      width: 100%;
      min-width: fit-content;
      min-height: 1em;
      font: inherit;
      resize: none;
      white-space: pre-wrap;
   }

   textarea::-webkit-scrollbar {
      width: 0;
   }
`

/**
 * 能够弹性伸缩的多行文本输入框
 */
export class FlexArea extends HTMLElement implements WebComponent {
   #textarea: HTMLTextAreaElement
   #p: HTMLElement

   get placeholder() { return this.#textarea.placeholder }
   set placeholder(val: string) { this.#textarea.placeholder = val }

   get value() { return this.#textarea.textContent! }
   set value(val: string) { this.#textarea.textContent = val }

   get disabled() { return this.#textarea.disabled }
   set disabled(val: boolean) {
      this.setAttribute('disabled', val + '')
      this.#textarea.disabled = val
   }

   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true })
      shadow.innerHTML = `
      <div>
      <textarea part="pre"></textarea>
      <p></p>
      </div>
      `

      const textarea = this.#textarea = shadow.querySelector('textarea')!
      const p = this.#p = shadow.querySelector('p')!
      let memory = ''
      const update = (e: Event) => {
         this.#p.style.height = '1em'
         this.#p.style.height = this.#textarea.scrollHeight + 'px'
      }
      textarea.addEventListener('input', update)
      textarea.addEventListener('paste', update)
      textarea.addEventListener('keydown', (e: KeyboardEvent) => {
         update(e)
         if (e.key === 'Enter' && memory !== this.value) {
            memory = this.value
            this.dispatchEvent(new CustomEvent('change', { bubbles: false }))
         }
      })
      textarea.addEventListener('blur', () => {
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
         this.#textarea.disabled = nv !== 'true'
      } else if (name === 'placeholder') {
         this.placeholder = nv
      }
   }

   connectedCallback(): void {
      setTimeout(() => {
         this.#p.style.height = '1em'
         this.#p.style.height = this.#textarea.scrollHeight + 'px'
      })
   }
}

if (!customElements.get('flex-area'))
   customElements.define('flex-area', FlexArea)
