import { shallowReactive } from 'vue';

import { globalEvent } from '@/boot/apis';
import { IS_DEV, useConfig } from '@/stores/config';
import { EventEmitter, useMemo } from '@ra2inier/core';

import { logger } from './log';

/**
 * 内容主体页面的选项卡类型,每一个新的页面均需要注册到此
 */
export enum PanelType {
   Tutorial = "Tutorial",
   WordEditor = "WordEditor",
   ObjectEditor = "ObjectEditor",
   Welcome = "Welcome",
   ProjectInfo = "ProjectInfo",
   None = "None",
   ScopeEditor = "ScopeEditor",
   Mappers = "MapperEditor",
   DEBUG = 'Debug',
   Setting = 'Setting',
   API = "API",
   NewProject = 'NewProject',
   ObjectViewer = 'ObjectViewer'
}

/**
 * 用以创建一个新的页面所需的参数
 */
export class PanelParam extends EventEmitter {
   /**
    * 页面的标签名称
    */
   label: string = PanelType.Welcome
   /**
    * 页面的类型
    */
   type: string = PanelType.Welcome
   /**
    * 传递给页面组件数据
    */
   data: any
   /**
    * 告诉派生组件，该数据不可修改
    */
   readonly: boolean = false
   /**
    * 预示着数据发生了改变
    */
   changed: boolean = false
   /**
    * 处理结果
    */
   result: any

   constructor(init: Partial<PanelParam>) {
      super()
      this.data = init.data || ''
      this.label = init.label || 'NEW_LABEL'
      this.type = init.type || PanelType.Welcome
      this.readonly = !!init.readonly
   }
}

export interface PanelTab {
   id: number,
   order: number,
   position: boolean,  // true为左，false为右
   param: PanelParam
}

const initLeftPanel: PanelTab = {
   id: 1,
   order: 0,
   position: true,
   param: new PanelParam({ label: PanelType.Welcome })
}
initLeftPanel.param.type = IS_DEV ? PanelType.API : PanelType.Welcome

const NONE: PanelTab[] = [
   {
      id: -1,
      order: -1,
      position: true,
      param: new PanelParam({ label: PanelType.None, type: PanelType.None }),
   },
   {
      id: -2,
      order: -2,
      position: false,
      param: new PanelParam({ label: PanelType.None, type: PanelType.None })
   }
]

export const panelList = shallowReactive<PanelTab[]>([initLeftPanel])
export const curPanel = shallowReactive<PanelTab[]>([initLeftPanel, NONE[1]])

function initPanel() {
   panelList.splice(0)
   panelList[0] = initLeftPanel
   curPanel[0] = initLeftPanel
   curPanel[1] = NONE[1]
}
globalEvent.on('project-loaded', initPanel)

export function selectTab(tab: PanelTab) {
   const position = tab.position ? 0 : 1
   curPanel[position] = tab
}

export function selectTabByID(id: number) {
   let tab = panelList.find(tab => tab.id === id)
   if (tab) selectTab(tab)
}

/**
 * 关闭所给定id值的panel，并且触发param的回调函数
 */
export function closeTab(id: number) {
   // @ts-ignore
   let rm: PanelTab = {}
   for (let i = 0; 0 < panelList.length; ++i) {
      if (id === panelList[i].id) {
         rm = panelList.splice(i, 1)[0]
         const p = rm.param
         p.emit('before-closed', p.result)
         if (!p.readonly && p.changed) p.emit('save', p.result)
         p.emit('closed', p.result)
         break
      }
   }
   for (let panel of panelList) {
      if (panel.order > rm.order) panel.order--
   }
   if (rm.id == curPanel[0].id || rm.id == curPanel[1].id) {
      if (panelList.length > 0) selectTab(panelList[0])
   }
   if (panelList.length == 0) {
      const position = rm.position ? 0 : 1
      selectTab(NONE[position])
   }
}

/**
 * 关闭所有选项卡
 */
export function colseAllTabs(pos: 'left' | 'right') {
   const position = pos === 'left'
   for (const tab of panelList) {
      if (position === tab.position) closeTab(tab.id)
   }
}


const { get: getRandom } =
   useMemo((a) => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), undefined, 999_999_999)
function createId(param: PanelParam) {
   const str = param.type
   const str2 = param.data
      ? (param.data.key ? param.data.key : 'k')
      : param.label

   return getRandom(str + str2)
}


/**
 * 添加一个新的页面，需要传入页面所需的必要参数
 */
export function addPanel(param: PanelParam) {
   // 查看是否已经相同的panel，判定的依据是两个页面的data和panelType是否相同，
   // 如果相同则聚焦该panel,不再添加新的panel
   const target = panelList.find((val) => {
      let d1, d2
      if (!(val.param && (d1 = val.param.data) && (d2 = param.data))) return false
      let a = val.param.type === param.type && d1 === d2
      if (d1.key && d1.key === d2.key) a = true
      return a
   })
   if (target) {
      selectTab(target)
      return false
   }
   if (panelList.length > (useConfig().MAX_TAB_AMOUNT || 30)) {
      logger.warn('打开的页面太多')
      return false
   }
   panelList.push({
      id: createId(param),
      order: panelList.length,
      param: shallowReactive(param),
      position: true
   })
   selectTab(panelList[panelList.length - 1])
   return true
}
