

export interface IItem {
   value: string
   selected: boolean
   popup: string
   key: string
   detail: string
}

export class Item implements IItem {
   id = ''
   key = ''
   value = ''
   selected = false
   popup = ''
   detail = ''
   src: Partial<IItem> = {}

   constructor(x: Partial<IItem>) {
      if (typeof x === 'string') {
         this.value = x
      } else {
         this.value = x.value || ''
         this.popup = x.popup || ''
         this.detail = x.detail || ''
         this.selected = !!x.selected
         this.key = x.key || Math.random() + ''
      }
      this.src = x
      this.id = '+' + Math.random() + x.key
   }
}

export type EmitType = [item: IItem, order: number]


