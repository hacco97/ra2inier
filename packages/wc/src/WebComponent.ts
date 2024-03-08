export interface WebComponent {
   connectedCallback?(): void
   disconnectedCallback?(): void
   adoptedCallback?(): void
   attributeChangedCallback?(name: string, oldValue: string, newValue: string): void
}

export namespace WebComponent {
   export const observedAttributes: string[] = []
}


const spliter = /(?<=\})\s/
export function css(s: TemplateStringsArray) {
   return createSheet(s.join().split(spliter))
}

export function createSheet(styles: string[]) {
   styles = styles.filter(x => x.trim())
   const sheet = new CSSStyleSheet()
   styles.forEach(rule => sheet.insertRule(rule))
   return sheet
}

export function html(str: TemplateStringsArray, ...tags: any[]) {
   const ret: any[] = []
   for (let i = 0; i < tags.length; ++i) {
      ret.push(str[i], tags[i])
   }
   ret.push(str[str.length - 1])
   return ret.join('')
}

