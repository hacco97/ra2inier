import { EventEmitter } from '@ra2inier/core';
import { reactive, ref } from 'vue';

// 记录视图布局相关的数据，这些数据需要全局共享
const LEFTWIDTH = Symbol()
const FOOTHEGHT = Symbol()
const MEMO = Symbol()
const CLOSED = Symbol()


// 左边栏的宽度
export class LeftTabSize {
   [LEFTWIDTH] = 0;
   [MEMO] = 300;
   [CLOSED] = true

   get widthS() { return { 'flex-basis': this.width + 'px' } }

   close() {
      this[MEMO] = this[LEFTWIDTH]
      this[LEFTWIDTH] = 0
      this[CLOSED] = true
   }

   open() {
      this[LEFTWIDTH] = this[MEMO]
      this[CLOSED] = false
   }

   get width() { return this[LEFTWIDTH] }
   set width(val) {
      if (val > 0) this[CLOSED] = false
      this[LEFTWIDTH] = val
   }
}
export const leftTabSize = reactive(new LeftTabSize)

// 下边栏的高度
export class FootTabSize extends EventEmitter {
   [FOOTHEGHT]: number = 25;
   [MEMO]: number = 300;
   [CLOSED]: boolean = true;
   canHidden = false
   active = false

   get heightS() { return { height: this[FOOTHEGHT] + 'px' } }
   recover() {
      this[FOOTHEGHT] = this[MEMO]
      if (this[FOOTHEGHT] > 0) this[CLOSED] = false
   }
   // 无记忆
   min() {
      this[MEMO] = this[FOOTHEGHT]
      this[FOOTHEGHT] = 0
      this[CLOSED] = true
   }
   // 无记忆
   max() {
      this[MEMO] = this[FOOTHEGHT]
      this[FOOTHEGHT] = 9999
      this[CLOSED] = true
   }
   get height() { return this[FOOTHEGHT] }
   set height(val) {
      if (val > 0) this[CLOSED] = false
      this[MEMO] = this[FOOTHEGHT]
      this[FOOTHEGHT] = val
   }
}
export const footTabSize = reactive(new FootTabSize)

export const tryUnFocusFoottab = () => {
   if (footTabSize.active) return
   footTabSize.min()
   footTabSize.active = false
}

// 全局遮罩
const isMasked = ref(false)
const callbacks: Function[] = []

export function closeMask() {
   callbacks.forEach(cb => cb())
   isMasked.value = false
}

export function useMask(cb?: Function) {
   cb && callbacks.push(cb)
   return {
      isMasked,
      show() { isMasked.value = true }
   }
}
