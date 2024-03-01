import { css } from './cssUtils';
import { WebComponent } from './WebComponent';

const styleSheet = css`
   :host {
      display: inline-block;
      box-sizing: border-box;
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
      min-height: 1em;
   }

   textarea {
      all: unset;
      position: absolute;
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      min-width: fit-content;
      min-height: 1em;
      font: inherit;
      resize: none;
      white-space: pre-wrap;
      overflow: hidden;
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

   get value() { return this.#textarea.value }
   set value(val: string) {
      this.#textarea.value = val
      this.updateHeight()
   }

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
      const update = (e: Event) => {
         textarea.style.height = '1em'
         p.style.height = textarea.style.height = textarea.scrollHeight + 'px'
      }
      textarea.addEventListener('paste', update)
      textarea.addEventListener('input', update)
      function insert(str: string) {
         const i = Math.min(textarea.selectionStart, textarea.selectionEnd)
         const j = Math.max(textarea.selectionStart, textarea.selectionEnd)
         textarea.setRangeText(str, i, j)
         textarea.setSelectionRange(i + str.length, i + str.length)
      }
      textarea.addEventListener('keydown', (e: KeyboardEvent) => {
         if (e.key === 'Tab') {
            insert('   ')
            e.preventDefault()
         } else if (e.key === 'Enter') {
            insert('\n')
            e.preventDefault()
            update(e)
         }
      })
      textarea.addEventListener('change', () => {
         this.dispatchEvent(new CustomEvent('change', { detail: this.#textarea.value }))
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

   private updateHeight() {
      this.#textarea.style.height = '1em'
      this.#p.style.height = this.#textarea.style.height = this.#textarea.scrollHeight + 'px'
   }

   connectedCallback() {
      setTimeout(() => {
         this.updateHeight()
      })
   }
}

if (!customElements.get('flex-area'))
   customElements.define('flex-area', FlexArea)
