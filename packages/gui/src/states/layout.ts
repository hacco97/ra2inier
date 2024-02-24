import { reactive, ref } from 'vue';

// 记录视图布局相关的数据，这些数据需要全局共享

// 左边栏的宽度
export class LeftTabSize {
   private _width = 0
   memory = 300
   closed = true

   get widthS() { return { 'flex-basis': this.width + 'px' } }

   close() {
      this._width = 0
      this.closed = true
   }

   open() {
      this._width = this.memory
      this.closed = false
   }

   get width() { return this._width }
   set width(val) {
      if (val > 0) this.closed = false
      this._width = val
   }
}
export const leftTabSize = reactive(new LeftTabSize)


// 下边栏的高度
export class FootTabSize {
   private _height: number = 25
   private memory: number = 300
   protected closed: boolean = true
   active = false

   get heightS() { return { height: this._height + 'px' } }
   recover() {
      this._height = this.memory
      if (this._height > 0) this.closed = false
   }
   // 无记忆
   min() {
      this.memory = this._height
      this._height = 0
      this.closed = true
   }
   // 无记忆
   max() {
      this.memory = this._height
      this._height = 9999
      this.closed = true
   }
   get height() { return this._height }
   set height(val) {
      if (val > 0) this.closed = false
      this.memory = this._height
      this._height = val
   }
}
export const footTabSize = reactive(new FootTabSize)

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
