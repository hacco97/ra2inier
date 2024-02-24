import { computed, ref, shallowReactive, StyleValue } from 'vue';

import { EventBus } from '@/hooks/eventBus';
import { PanelHandler } from '@/states/panelList';
import {
  getWord, queryWordByNameSync, validateWord,
} from '@/stores/projectStore';
import {
  createParam, Entry, IniObjectRo, removeFrom, WordRo,
  WordValidity,
} from '@ra2inier/core';

// 常量定义
const NULL_WORD = new WordRo('未知词条')
NULL_WORD.valueParam = [createParam()]
const NOT_FOUND = 'not-found'
const WORD_KEY = Symbol()
const ENTRY_VID = Symbol()

// 字段对象，代表一个字段的所需信息
export class EntryRo {
   static nextID = 0
   readonly id: number = 0
   // 顺序，用于焦点逻辑和排序逻辑
   order: number = 0
   // 字段的word名字
   key: string = ''

   // 字段的word具体值，列表，中间用“,”分割
   values: string[] = [];
   // 当前字段的活动值索引
   [ENTRY_VID] = 0
   get vid() { return this[ENTRY_VID] }
   set vid(vid: number) {
      vid >= this.values.length && (vid = this.values.length - 1)
      vid < 0 && (vid = 0)
      this[ENTRY_VID] = vid
   }
   // 字段的注释
   comment?: string
   // 是否折叠子面板
   isSubFolded = true
   // 该字段是否被选中
   selected: boolean = false
   // 该字段的合法性
   validitys: WordValidity[] = shallowReactive([])
   // 该字段的合法性，提示
   prediction: string = '';
   // 字段word的key值
   [WORD_KEY] = ''
   get wordKey() { return this.word.key }
   // 该字段的UI校验参数
   get word() {
      let tmp
      if (!!this[WORD_KEY]) {
         if (this[WORD_KEY] === NOT_FOUND) return NULL_WORD
         tmp = getWord(this[WORD_KEY]) ?? NULL_WORD
      } else {
         // TODO: 待升级为沿项目依赖进行查找
         tmp = queryWordByNameSync(this.key)
         this[WORD_KEY] = NOT_FOUND
         if (tmp) this[WORD_KEY] = tmp.key
         else tmp = NULL_WORD
      }
      return tmp
   }
   get isNullWord() { return this.word === NULL_WORD }

   get typeParams() {
      return this.word.valueParam
   }

   get typeParam() {
      return this.word.valueParam[this.vid] ?? NULL_WORD.valueParam[0]
   }

   constructor(entry: Entry) {
      this.id = EntryRo.nextID++
      this.key = entry.key
      this.values = entry.values
   }

   set value(value: string) {
      // TODO: 在此进行赋值的拦截

      this.values[this.vid] = value
   }

   get value() {
      return this.values[this.vid ?? 0]
   }

   setValue(val: any, vid?: number) {
      this.values[vid ?? this.vid] = val + ''
   }

   get fullValue() {
      return this.values.join(',')
   }

   push(str: string) {
      this.values.push(str)
   }

   pop(vid?: number) {
      vid ?? (vid = this.vid)
      return this.values.splice(vid, 1)[0]
   }

   get length() { return this.values.length }
}


const COLUMN_COUNT = Symbol()
// 管理单个objEditor的数据
export class EditorState extends EventBus {
   // 源对象数据
   data: IniObjectRo
   handler: PanelHandler
   // 词条数据
   entrys = shallowReactive<EntryRo[]>([])
   get(id: number) {
      return this.entrys[id]
   }
   // 新词条输入框的文字值
   theNew = ''
   // 对象详情
   detail = '';

   // 分栏数目
   [COLUMN_COUNT] = 1
   get columnCount() { return this[COLUMN_COUNT] }
   set columnCount(val: number) {
      if (val < 1) val = 1
      if (val > 4) val = 4
      this[COLUMN_COUNT] = val
   }

   constructor(object: IniObjectRo, handler: PanelHandler) {
      super()
      const word: IniObjectRo = this.data = object
      for (let i = 0, len = word.entry.length; i < len; ++i) {
         const tmp = shallowReactive(new EntryRo(word.entry[i]))
         this.entrys.push(tmp)
         // TODO:
         // tmp.wordKey
      }
      this.detail = object.detail
      this.handler = handler
      this.reOrder()
   }

   /**
    * 添加一个词条，返回索引值，若已存在则返回那个词条的索引值
    */
   insert(key = '', val = '') {
      if (!key) return -1
      const words = this.entrys
      for (let i of words) {
         if (i.key === key) {
            return i.order
         }
      }
      words.push(new EntryRo({
         key,
         values: [val]
      }))
      this.reOrder()
      return this.length - 1
   }

   /**
    * 删除词条
    */
   deleteEntryById(id: number) {
      for (let index = 0; index < this.entrys.length; index++) {
         const element = this.entrys[index];
         if (element.id === id) return this.entrys.splice(index, 1)
      }
      return undefined
   }

   /**
    * 取消所有词条的选中
    */
   removeSelected() {
      // for (let i = 0; i < this.entrys.length; ++i) {
      //    if (this.entrys[i].selected === true) {
      //       this.entrys.splice(i--, 1)
      //    }
      //    this.entrys[i].order = i
      // }
      removeFrom(this.entrys, e => e.selected)
      this.reOrder()
   }

   /**
    * 为该词条添加注释
    */
   commentById(id: number, comment: string) {
      if (this.entrys[id])
         this.entrys[id].comment = comment
   }

   /**
    * 修改词条数据
    */
   setValueById(id: number, val: string | number, vid?: number) {
      this.entrys[id].setValue(val + '', vid)
   }


   // /**
   //  * 翻译词条
   //  */
   // translate() {
   //    // TODO:环境变量的逻辑
   //    translateWord()

   // }

   /**
    * 最终保存和提交数据的函数
    */
   save() {
      // 拷贝数据到原对象中
      if (!this.data) return
      const entry: Entry[] = []
      let tmp: Entry
      for (let word of this.entrys) {
         tmp = {
            key: word.key,
            values: word.values
         }
         word.comment && (tmp.comment = word.comment)
         entry.push(tmp)
      }
      this.data.entry = entry
      this.data.detail = this.detail

      // 执行保存命令
      // saveObject(this.data)
      this.handler.onSave!(this.data)
   }

   async validateWordById(id: number) {
      console.log('valid' + id)
      const entry = this.entrys[id]
      const validity = await validateWord(entry.wordKey, entry.values)
      if (!entry.validitys.find(
         x => x.status === validity.status && x.msg === validity.msg
      )) { entry.validitys.push(validity) }
   }

   // 词条值编号逻辑
   length = 0
   /**
    * 重新为每个词条编号，为了让focus逻辑运作所额外付出的逻辑负担
    */
   reOrder() {
      let order = 0
      for (let i = 0; i < this.entrys.length; ++i) {
         const word = this.entrys[i]
         word.order = order
         order += word.values.length
      }
      this.length = order
   }
}


//  提示框的状态
/**
 * 状态抽出：提示框的定位数据
 */
export function usePromptCoord() {
   const x = ref(0), y = ref(0)
   const translate = computed<StyleValue>(() => {
      return {
         translate: `${x.value}px ${y.value}px`,
      }
   })

   function onRowFocus(e: Event) {
      const el = <HTMLElement>e.currentTarget
      y.value = el.offsetTop + el.offsetHeight
   }

   function onColFocus(e: Event) {
      const el = <HTMLElement>e.currentTarget
      x.value = el.offsetLeft
   }

   return {
      translate,
      onRowFocus,
      onColFocus
   }
}


// 游标标识的逻辑
/**
 * 状态抽出：游标的定位数据
 */
export function useCursorCoord() {
   // entry的ID值
   const current = ref(-1)
   function onRowClick(eid: number) {
      current.value = eid
   }

   return {
      onRowClick,
      current,
   }
}
