import { reactive, ref } from 'vue';

import {
  overrideArray, WordValueType, WordValueTypeParam,
} from '@ra2inier/core';

import { EntryRo } from '../ObjectEditor/Entry';
import { PromptState, PromptType } from './promptState';

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
   state.on('init-' + PromptType.enum, (entry: EntryRo) =>
      overrideArray(createOptions(entry.typeParam), options))

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
