import { reactive } from 'vue';

import bellSvg from '@/asset/icons/bell.svg?raw';
import compileSvg from '@/asset/icons/compile.svg?raw';
import consoleSvg from '@/asset/icons/console.svg?raw';
import taskSvg from '@/asset/icons/task.svg?raw';
import { messageList, onMessage } from '@/stores/messageStore';

export interface FootTab {
   id: number,
   order: number,
   label: string,
   type: string,
   name: string,
   badge: string,
   toolButtons: string[]
}

export enum FootTabType {
   Dialog = 'Dialog',
   TaskQueue = 'TaskQueue',
   Output = 'Output',
   Message = 'Message'
}


export const footTabList = reactive<FootTab[]>([
   {
      id: 0,
      order: 0,
      label: consoleSvg,
      type: FootTabType.Dialog,
      name: '控制台',
      badge: '12',
      toolButtons: []
   },
   {
      id: 1,
      order: 1,
      label: taskSvg,
      type: FootTabType.TaskQueue,
      name: '任务队列',
      badge: '',
      toolButtons: []
   },
   {
      id: 2,
      order: 2,
      label: compileSvg,
      type: FootTabType.Output,
      name: '构建',
      badge: '',
      toolButtons: []
   },
   {
      id: 3,
      order: 3,
      label: bellSvg,
      type: FootTabType.Message,
      name: '通知',
      badge: '',
      toolButtons: []
   }
])

const messageTab = footTabList[3]
export function setMessageBadge(n: string | number) {
   messageTab.badge = n + ''
}
onMessage(() => { setMessageBadge(messageList.length) })
setMessageBadge(messageList.length)

export function selectFootTabByType(type: FootTabType) {
   for (const tab of footTabList) {
      if (tab.type = type)
         return selectFootTab(tab)
   }
}

const selected = reactive({
   id: footTabList[0].id,
   type: footTabList[0].type
})

export function selectFootTab(tab: FootTab) {
   selected.id = tab.id
   selected.type = tab.type
}

export function useFootSelect() {
   return {
      selected,
      select: selectFootTab
   }
}

export function exchangeFootTab(id1: number, id2: number) {

}
