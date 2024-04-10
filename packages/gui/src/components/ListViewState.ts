

export interface IItem {
   [s: string]: any
   value: string
   selected: boolean
   key: string
   detail: string
}

export class Item implements IItem {
   [s: string]: any
   id = ''
   src: any = {}
   key = ''
   value = ''
   selected = false
   detail = ''

   constructor(x: Partial<IItem> | string) {
      if (typeof x === 'string') {
         this.value = x
      } else {
         this.value = x.value || ''
         this.detail = x.detail || ''
         this.selected = !!x.selected
         this.key = x.key || Math.random() + ''
      }
      this.src = x
      this.id = '+' + Math.random() + (this.src.key || this.src)
   }
}

export type EmitType = [item: IItem, order: number]


