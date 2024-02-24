import { round } from 'lodash';

import { styleSheet } from './FlexInput';
import { WebComponent } from './WebComponent';

const WITH_PERCENT = /\%/

/**
 * 支持百分数形式、最大最小值校验、精度校验的数字类型输入框
 */
export class NumberInput extends HTMLElement implements WebComponent {
   #span: HTMLSpanElement
   #input: HTMLInputElement
   #value: number = 0

   static observedAttributes = ["min", "max", "precision", "percent"]
   #min = 0; #max = Number.MAX_VALUE; #percent = false; #precision = 0;
   attributeChangedCallback(name: string, ov: string, nv: string) {
      switch (name) {
         case 'min':
            this.#min = parseFloat(nv) || parseFloat(ov)
            if (isNaN(this.#min)) this.#min = 0
            break
         case 'max':
            this.#max = parseFloat(nv) || parseFloat(ov)
            if (isNaN(this.#max)) this.#max = Number.MAX_VALUE
            break
         case 'precision':
            this.#precision = parseInt(nv) || 0
            this.#value = round(this.#value, this.#precision)
            break
         case 'percent':
            this.#percent = !!nv
         default:
      }
   }

   private parse(str: string) {
      const withPercent = !!str.trim().match(WITH_PERCENT)
      let val = parseFloat(str)
      val = withPercent ? val /= 100 : val
      this.#percent = withPercent
      if (isNaN(val)) return 0 > this.#min ? 0 : this.#min
      return this.validate(val)
   }

   private validate(val: number) {
      val = round(val, this.#precision)
      if (val < this.#min) val = this.#min
      if (val > this.#max) val = this.#max
      return val
   }

   get text() {
      if (this.#percent)
         return round(this.#value * 100, this.#precision - 2) + '%'
      else return this.#value + ''
   }

   set text(val: string) {
      this.#value = this.parse(val)
      this.setText(this.text)
   }

   private setText(str = this.text) {
      this.#input.value = str
      this.#span.textContent = str
   }

   get value() {
      return this.#value
   }

   set value(val: number) {
      this.#value = this.validate(val)
      this.setText(this.text)
      if (val !== this.#value) {
         this.dispatchEvent(new CustomEvent('invalid', {
            bubbles: false,
            detail: this.#value
         }))
      }
   }

   set disabled(val: boolean) {
      this.setAttribute('disabled', val ? 'true' : 'false')
      this.#input.disabled = !!val
   }



   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true })
      shadow.innerHTML = `
      <div>
      <span part="span"></span>
      <input type="text" part="input"/>
      </div>
      `
      const input = this.#input = shadow.querySelector('input')!
      const span = this.#span = shadow.querySelector('span')!
      input.addEventListener('input', (e: Event) => { span.textContent = input.value })
      input.addEventListener('change', () => {
         this.#value = this.parse(input.value)
         this.setText(this.text)
         this.dispatchEvent(new CustomEvent('change', { bubbles: false }))
      })
      this.setText(this.text)
      this.#value = 0 > this.#min ? 0 : this.#min
      shadow.adoptedStyleSheets.push(styleSheet)
   }

}

if (!customElements.get('number-input'))
   customElements.define('number-input', NumberInput)
