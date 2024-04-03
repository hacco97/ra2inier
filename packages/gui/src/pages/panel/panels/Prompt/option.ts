import { reactive, ref } from 'vue';
import {
   IniObjectRo, overrideArray, WordValueType, WordValueTypeParam,
} from '@ra2inier/core';

import { EntryRo } from '../ObjectEditor/Entry';
import { PromptState, PromptType } from './promptState';
import { useProjectStore } from '@/stores/projectStore';

export interface Option {
   id: number,
   value: string,
   text: string,
}

/**
 * option 类型参数的逻辑
 */
export function useOption(state: PromptState) {
   // **enum类型的逻辑**
   const options: Option[] = reactive([])
   // enum 类型的辅助参数
   const cursor = ref(0)
   const store = useProjectStore()
   state.on('init-' + PromptType.enum, (entry: EntryRo) => {
      const word = store.queryWord(entry.wordName)
      const param = word.valueParam[entry.vid]
      overrideArray(createOptions(param), options)
   })

   function nextOption() { cursor.value = (cursor.value + 1) % options.length }
   function prevOption() { cursor.value = (cursor.value - 1 + options.length) % options.length }
   state.on('next-' + PromptType.enum, nextOption)
   state.on('prev-' + PromptType.enum, prevOption)

   return {
      options,
      cursor,
      nextOption,
      prevOption
   }
}

/**
 * 创建一个新的options选项
 */
function createOptions(param: WordValueTypeParam) {
   const newOne = []
   let id = 0
   if (param.type === WordValueType.bool) {
      newOne.push({
         id: 0,
         value: 'yes',
         text: (param.optionRemarks?.[0]) ?? ''
      }, {
         id: 1,
         value: 'no',
         text: (param.optionRemarks?.[1]) ?? ''
      })
   } else if (param.type === WordValueType.enum) {
      for (const p in param.optiontmp) {
         newOne.push({
            id,
            value: p,
            text: (param.optionRemarks?.[id++]) ?? ''
         })
      }
   }
   return newOne
}

/**
 * 对象类型的逻辑
 */
export function useObjects(state: PromptState) {
   const objects = ref<IniObjectRo[]>([])
   const cursor = ref(0)

   state.on('init-' + PromptType.obj, (newList) => {
      if (newList instanceof Array) {
         cursor.value = 0
         objects.value = newList
      }
   })

   state.on('prev-' + PromptType.obj, () => {
      if (cursor.value - 1 < 0) cursor.value += objects.value.length
      cursor.value--
   })
   state.on('next-' + PromptType.obj, () => {
      cursor.value = (cursor.value + 1) % objects.value.length
   })

   return {
      objects,
      cursor
   }
}
