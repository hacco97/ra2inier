import { css } from './cssUtils';
import { WebComponent } from './WebComponent';

const styleSheet = css`
   :host {
      display: inline-block;
      box-sizing: border-box;
      width: fit-content;
      height: 100%;
      text-align: center;
      overflow: visible;
   }

   div {
      position: relative;
      height: 0;
      width: 100%;
      overflow: hidden;
   }

   p:hover+div, div:hover {
      overflow: visible;
   }

   section {
      position: absolute;
      height: 300px;
      width: 300px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background-color: transparent;
   }

   ul {
      position: absolute;
      z-index: 1;
      top: 50%;
      left: 50%;
      height: fit-content;
      width: fit-content;
      margin: 0;
      padding: 0;
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
         <p><slot></slot></p>
         <div>
            <section>
            <ul><slot name="pop"></slot></ul>
            </section>
         </div>
      `
      this.#div = shadow.querySelector('div')!
      shadow.adoptedStyleSheets.push(styleSheet)
   }

   /**
    * position值：left , top
    */
   #current = 'b'
   #map: Record<string, string[]> = {
      r: ['100%', '-100%'],
      b: ['0', '0'],
      rb: ['100%', '0']
   }

   get position() {
      return this.#current
   }

   set position(pos: string) {
      const p = this.#map[pos] ?? this.#map[pos = 'b']
      this.#div.style.left = p[0]
      this.#div.style.top = p[1]
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
