const spliter = /(?<=\})\s/
export function css(s: TemplateStringsArray) {
   return createSheet(s.join().split(spliter))
}

function createSheet(styles: string[]) {
   styles = styles.filter(x => x.trim())
   const sheet = new CSSStyleSheet()
   styles.forEach(rule => sheet.insertRule(rule))
   return sheet
}