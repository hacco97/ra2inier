import { showInFileFloder } from "@/boot/file"
import { WebComponent, css, html } from "@ra2inier/wc"

const styleSheet = css`
   :host {
      display: inline-flex;
   }
`

export class FileLink extends HTMLElement implements WebComponent {
   path: string = ''

   static observedAttributes = ['path']
   attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
      if (name === 'path') { this.path = newValue + '' }
   }

   constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.innerHTML = html`
         <a><slot></slot></a>
      `
      const a = shadow.querySelector('a')
      a?.addEventListener('click', () => {
         if (this.path) showInFileFloder(this.path)
      })
      shadow.adoptedStyleSheets.push(styleSheet)
   }
}
if (!customElements.get('file-link'))
   customElements.define('file-link', FileLink)
