import { ref } from 'vue';

import { NumberInput } from '@ra2inier/wc';

import { EntryRo } from '../ObjectEditor/Entry';
import { PromptState, PromptType } from './promptState';

/**
 * int类型的逻辑
 */
export function useInt(state: PromptState) {
   const intInput = ref<NumberInput>()

   function getInt() {
      intInput.value?.validate()
      return intInput.value!.value
   }

   function setInt(n: number) {
      intInput.value!.value = Math.round(n)
   }

   function changeInt(n = 1) {
      intInput.value?.add(n)
   }

   function isValid() {
      return (intInput.value?.validate()) || false
   }

   state.on('init-' + PromptType.int, (e: EntryRo) => {
      intInput.value!.text = e.value
   })

   state.on('prev-' + PromptType.int, () => {
      intInput.value?.add(1)
   })

   state.on('next-' + PromptType.int, () => {
      intInput.value?.add(-1)
   })

   return {
      getInt,
      setInt,
      changeInt,
      intInput,
      isValid
   }
}

/**
 * loat类型的逻辑
 */
export function useFloat(state: PromptState) {
   const floatInput = ref<NumberInput>()

   function getFloat() {
      floatInput.value?.validate()
      return floatInput.value!.text
   }

   function setFloat(n: number) {
      floatInput.value!.value = n
   }

   function changeFloat(n = 0.01) {
      // setFloat(getFloat() + n)
      floatInput.value?.add(n)
   }

   function isValid() {
      return floatInput.value?.validate() || false
   }

   state.on('init-' + PromptType.float, (e: EntryRo) => {
      floatInput.value!.text = e.value
   })

   return {
      floatInput,
      getFloat,
      setFloat,
      changeFloat,
      isValid
   }
}

