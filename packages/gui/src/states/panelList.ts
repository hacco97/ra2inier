import { shallowReactive } from 'vue';

import { IS_DEV } from '@/stores/config';

/**
 * 内容主体页面的选项卡类型,每一个新的页面均需要注册到此
 */
export enum PanelType {
   Tutorial = "Tutorial",
   WordViewer = "WordViewer",
   ObjEditor = "ObjEditor",
   Welcome = "Welcome",
   ProjectInfo = "ProjectInfo",
   None = "None",
   ScopeEditor = "ScopeEditor",
   Mappers = "MapperEditor",
   DEBUG = 'Debug',
   Setting = 'Setting',
   API = "API"
}

/**
 * 用以创建一个新的页面所需的参数
 */
export class PanelParam {
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
   data?: any
   /**
    * 可选的提供给页面组件用以调用的回调函数
    * onSave提供给页面组件用以保存数据的回调函数
    * onClose会在页面被关闭时调用，data参数会被传入
    */
   handler?: PanelHandler
}

export interface PanelHandler {
   onClose?: Function,
   onSave?: Function,
   [s: string]: Function | undefined
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
   param: new PanelParam
}
initLeftPanel.param.type = IS_DEV ? PanelType.API : PanelType.Welcome

const NONE = [
   {
      id: -1,
      order: -1,
      position: true,
      param: { label: '', type: PanelType.None }
   },
   {
      id: -2,
      order: -2,
      position: false,
      param: { label: '', type: PanelType.None }
   }
]

export const panelList = shallowReactive<PanelTab[]>([initLeftPanel])
export const curPanel = shallowReactive<PanelTab[]>([initLeftPanel, NONE[1]])

export function selectTab(tab: PanelTab) {
   const position = tab.position ? 0 : 1
   curPanel[position] = tab
}

export function selectTabByID(id: number) {
   let tab = panelList.find(tab => tab.id === id)
   if (tab) selectTab(tab)
}

/**
 * 关闭所给定id值的panel
 */
export function closeTab(id: number) {
   let rm: any = {}
   for (let i = 0; 0 < panelList.length; ++i) {
      if (id === panelList[i].id) {
         rm = panelList.splice(i, 1)[0]
         if (rm.param.onClose) rm.param.onClose(rm.param.data)
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


let nextID = 999
/**
 * 添加一个新的页面，需要传入页面所需的必要参数
 */
export function addPanel(param: PanelParam) {
   const target = panelList.find((val) => {
      let d1, d2
      if (!(val.param && (d1 = val.param.data) && (d2 = param.data))) return false
      let a = val.param.type === param.type && d1 === d2
      if (d1.key === d2.key) a = true
      return a
   })
   if (target) {
      selectTab(target)
      return false
   }
   panelList.push({
      id: nextID++,
      order: panelList.length,
      param: shallowReactive(param),
      position: true
   })
   selectTab(panelList[panelList.length - 1])
   return true
}

