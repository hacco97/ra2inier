import { shallowReactive } from 'vue';
import { useConfigStore } from '@/stores/config';
import { EventEmitter, useMemo } from '@ra2inier/core';
import { defineStore } from 'pinia';
import { globalEvent } from '@/boot/event';

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

const CHANGED = Symbol()
const DATA = Symbol()
const RESULT = Symbol()

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
   readonly type: string = PanelType.Welcome;
   /**
    * 传递给页面组件数据
    */
   [DATA]: any
   get init() { return this[DATA] }
   /**
    * 告诉派生组件，该数据不可修改
    */
   readonly readonly: boolean = false;
   /**
    * 预示着数据发生了改变
    */
   [CHANGED] = false;
   /**
    * 处理结果
    */
   [RESULT]: any

   constructor(init: Partial<PanelParam>) {
      super()
      this[DATA] = init.init || ''
      this.label = init.label || 'NEW_LABEL'
      this.type = init.type || PanelType.Welcome
      this.readonly = !!init.readonly
   }

   /**
    * 可以由派生组件调用，保存数据，并触发保存动作
    * 处理保存逻辑的回调将会被触发
    */
   save(data: any) {
      if (!data || this.readonly) return
      this[RESULT] = data
      this.emit('before-saved', data)
      this.emit('saved', data)
      this[CHANGED] = false
   }

   /**
    * 可以由派生组件调用，提交数据
    */
   submit(data: any) {
      if (!data) return
      this[RESULT] = data
      this[CHANGED] = true
   }

   /**
    * 可以由派生组件调用，主动关闭页面
    * 该方法由panel管理者注入
    */
   close() { throw Error('close method not implemented') }

   /**
    * 执行Param的关闭逻辑
    */
   static doClose(p: PanelParam) {
      p.emit('before-closed', p[RESULT])
      if (p[CHANGED]) p.save(p[RESULT])
      p.emit('closed', p[RESULT])
   }

   /**
    * before-closed，预示着页面即将被关闭
    * before-saved，预示着数据即将被保存，需要提供数据的函数可以进行监听
    * saved，需要处理最终数据的函数可以进行监听
    * closed，页面已经关闭完成
    */
}

const createPanelState = () => {
   const { config, IS_DEV } = useConfigStore()
   const initLeftPanel: PanelTab = {
      id: 1,
      order: 0,
      position: true,
      param: new PanelParam({
         label: PanelType.Welcome,
         type: IS_DEV ? PanelType.API : PanelType.Welcome
      })
   }
   const panelList = shallowReactive<PanelTab[]>([initLeftPanel])
   const curPanel = shallowReactive<PanelTab[]>([initLeftPanel, NONE_TYPE[1]])

   function selectTab(tab: PanelTab) {
      const position = tab.position ? 0 : 1
      curPanel[position] = tab
   }

   function selectTabByID(id: number) {
      let tab = panelList.find(tab => tab.id === id)
      if (tab) selectTab(tab)
   }

   /**
    * 关闭所给定id值的panel，并且触发param的回调函数
    */
   function closeTab(id: number) {
      // @ts-ignore
      let rm: PanelTab = {}
      for (let i = 0; 0 < panelList.length; ++i) {
         if (id === panelList[i].id) {
            rm = panelList.splice(i, 1)[0]
            PanelParam.doClose(rm.param)
            break
         }
      }
      for (let panel of panelList) {
         if (panel.order > rm.order) panel.order--
      }
      if (rm.id == curPanel[0].id || rm.id == curPanel[1].id) {
         if (panelList.length > 0) selectTab(panelList[0])
      }
      if (panelList.length === 0) {
         const position = rm.position ? 0 : 1
         selectTab(NONE_TYPE[position])
      }
   }

   /**
    * 关闭所有选项卡
    */
   function colseAllTabs(pos: 'left' | 'right') {
      const position = pos === 'left'
      for (const tab of panelList) {
         if (position === tab.position) closeTab(tab.id)
      }
   }

   /**
    * 添加一个新的页面，需要传入页面所需的必要参数
    */
   function addPanel(param: PanelParam) {
      // 查看是否已经相同的panel，判定的依据是两个页面的data和panelType是否相同，
      // 如果相同则聚焦该panel,不再添加新的panel
      const target = panelList.find((val) => {
         let d1, d2
         if (!(val.param && (d1 = val.param.init) && (d2 = param.init))) return false
         let a = val.param.type === param.type && d1 === d2
         if (d1.key && d1.key === d2.key) a = true
         return a
      })
      if (target) {
         selectTab(target)
         return false
      }
      if (panelList.length > (config.MAX_TAB_AMOUNT || 30)) {
         return false
      }
      /**
       * 注入页面的关闭函数
       */
      param.close = () => { closeTab(createId(param)) }
      panelList.push({
         id: createId(param),
         order: panelList.length,
         param: shallowReactive(param),
         position: true
      })
      selectTab(panelList[panelList.length - 1])
      return true
   }

   return {
      panelList,
      curPanel,
      addPanel,
      selectTab,
      selectTabByID,
      closeTab,
      colseAllTabs
   }
}

export interface PanelTab {
   id: number,
   order: number,
   position: boolean,  // true为左，false为右
   param: PanelParam
}

const NONE_TYPE: PanelTab[] = [
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

const [getRandom] = useMemo(
   (a) => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
   undefined,
   Number.MAX_SAFE_INTEGER
)
function createId(param: PanelParam) {
   const str = param.type
   const str2 = param.init
      ? (param.init.key ? param.init.key : 'k')
      : param.label
   return getRandom(str + str2)
}

export const usePanelState = defineStore('panel-state', { state: createPanelState })
export type PanelState = ReturnType<typeof usePanelState>
/**
 * 每当，打开一个新的项目时，都要将当前的选项卡全部清空
 */
globalEvent.on('project-loaded', () => { usePanelState().$reset() })
