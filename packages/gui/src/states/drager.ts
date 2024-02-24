import { reactive, ref } from "vue"
 // 全局拖放逻辑的控制模块

export interface Drager {
  from?: string,
  to?: string,
  type?: number,
  data?: any,
  [str: string]: any
}

export enum DragType {
  None,
  PanelTab,
  LeftTab,
  FootTab
}

export const drager = reactive<Drager>({
  from: '',
  to: '',
  type: DragType.None,
  data: ''
})

export function dragStart(ev: DragEvent, dragInfo: Drager) {
  for (let key in dragInfo) {
    drager[key] = dragInfo[key]
  }
  ev.dataTransfer!.dropEffect = 'move'
  ev.dataTransfer!.effectAllowed = 'move'
}

document.querySelector('body')?.addEventListener('dragend', (ev) => {
  for (let key in drager) {
    drager[key] = undefined
  }
})
