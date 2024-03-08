import { css } from './cssUtils';
import { WebComponent } from './WebComponent';

const styleSheet = css`
   :host {
      display: inline-block;
      box-sizing: border-box;
      text-align: center;
      overflow: visible;
   }

   * {
      margin: 0;
      padding: 0;
   }

   ol {
      position: relative;
      overflow: hidden;
      z-index: 11;
   }

   ol:has(>*:hover) {
      overflow: visible;
      z-index: 99;
   }

   ol:has(>*:hover) >div {
      visibility: visible;
   }

   p {
      position: relative;
      z-index: 5;
   }

   section {
      position: absolute;
      inset: -12px;
   }

   div {
      position: absolute;
      z-index: 1;
      top: 100%;
      left: 0%;
      visibility: hidden;
   }

`

/**
 * 能够弹性伸缩的单行文本输入框
 */
export class PopupBox extends HTMLElement implements WebComponent {

   #div: HTMLDivElement

   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true })
      shadow.innerHTML = `
         <ol>
            <p><slot></slot></p>
            <section></section>
            <div><slot name="pop"></slot></div>
         </ol>
      `
      this.#div = shadow.querySelector('div')!
      shadow.adoptedStyleSheets.push(styleSheet)
   }

   /**
    * position值：left , top
    */
   #current = 'top-100%,left-0'
   static #Set = new Set(['left', 'top', 'right', 'bottom'])

   get position() {
      return this.#current
   }

   /**
    * 格式：例如：'top-100px,right-100px'
    */
   set position(pos: string) {
      const kv = pos.split(',').map(x => x.split('-'))
      for (const e of kv) {
         if (PopupBox.#Set.has(e[0]))
            this.#div.style.setProperty(e[0], e[1])
      }
      this.#current = pos
   }

   static observedAttributes = ['position']
   attributeChangedCallback(name: string, ov: string, nv: string): void {
      if (name === 'position') {
         this.position = nv
      }
   }
}


if (!customElements.get('popup-box'))
   customElements.define('popup-box', PopupBox)
