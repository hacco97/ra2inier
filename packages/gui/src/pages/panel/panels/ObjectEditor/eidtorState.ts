import { computed, ref, shallowReactive, StyleValue } from 'vue';

import { queryObject, validateWord } from '@/stores/projectStore';
import {
   cloneTyped, Entry, EventEmitter, IniObjectRo, removeFrom,
   WordValueType,
} from '@ra2inier/core';
import { FlexInput } from '@ra2inier/wc';

import { PromptState, PromptType } from '../Prompt/promptState';
import { EntryRo } from './Entry';

const COLUMN_COUNT = Symbol('column count')
// 管理单个ObjectEditor的数据
export class EditorState extends EventEmitter {
   // 源对象数据
   data: IniObjectRo
   // 词条数据
   entrys = shallowReactive<EntryRo[]>([])
   get(id: number) {
      return this.entrys[id]
   }
   // 新词条输入框的文字值
   theNew = ''
   // 对象详情
   detail = ''
   // 当前子对象
   currentChild = '';

   // 分栏数目
   [COLUMN_COUNT] = 1
   get columnCount() { return this[COLUMN_COUNT] }
   set columnCount(val: number) {
      if (val < 1) val = 1
      if (val > 4) val = 4
      this[COLUMN_COUNT] = val
   }

   constructor(object: IniObjectRo) {
      super()
      const word: IniObjectRo = this.data = cloneTyped(object, IniObjectRo)
      for (let i = 0, len = word.entry.length; i < len; ++i) {
         const tmp = shallowReactive(new EntryRo(word.entry[i]))
         this.entrys.push(tmp)
         // TODO:
         // tmp.wordKey
      }
      this.detail = object.detail
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

   /**
    * 最终保存和提交数据的函数
    */
   get value() {
      // 拷贝数据到原对象中
      if (!this.data) return
      const ret = cloneTyped(this.data, IniObjectRo)
      ret.entry = []
      ret.detail = this.detail
      let tmp: Entry
      for (let word of this.entrys) {
         tmp = {
            key: word.key,
            values: word.values
         }
         word.comment && (tmp.comment = word.comment)
         ret.entry.push(tmp)
      }
      return ret
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
      onColFocus,
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

/**
 * 查询逻辑
 */
export function useQueryObject(promptState: PromptState) {
   let querying = false

   async function onInputKeyup(e: KeyboardEvent) {
      if (promptState.type !== PromptType.obj) return
      if (querying) return
      if (e.ctrlKey || e.altKey) return
      if (e.key.length !== 1 && !whiteName.has(e.key)) return
      querying = true
      await changeObjectsOptions((<FlexInput>e.target).value)
      await waitALittle()
      querying = false
   }

   function changeObjectsOptions(startString: string) {
      const param = promptState.entry.typeParam
      if (param.type !== WordValueType.obj) return
      const objects = queryObject('objects', (object) => {
         let rate = 0
         if (object.scope === param.objectType) rate += 2
         if (object.name.startsWith(startString)) rate += 2
         else if (object.name.toLowerCase().startsWith(startString.toLowerCase()))
            rate += 1
         return rate
      })
      promptState.setObjects(objects)
   }

   function waitALittle() {
      return new Promise(r => setTimeout(r, 50))
   }

   const whiteName = new Set([
      'Backspace', 'Delete'
   ])

   return {
      onInputKeyup
   }
}

