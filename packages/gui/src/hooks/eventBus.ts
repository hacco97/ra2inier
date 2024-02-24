type BusMap = {
   [key: string]: Callback[];
};

const BUS_ID = Symbol('bus callback id')
const BUS_MAP = Symbol('bus map')

interface Callback {
   (...args: any[]): void
   [BUS_ID]?: string
}

export class EventBus {
   [BUS_MAP]: BusMap = {}

   /**
    * 监听一个事件/订阅一个频道
    */
   on(event: string, callback: Callback, busId?: string) {
      if (!event) return
      if (busId) { callback[BUS_ID] = busId }
      if (event in this[BUS_MAP]) {
         for (let c of this[BUS_MAP][event]) {
            if (c === callback) return
            if (busId && c[BUS_ID] === callback[BUS_ID]) return
         }
         this[BUS_MAP][event].push(callback)
      } else {
         this[BUS_MAP][event] = [callback]
      }
   }

   /**
    * 取消订阅一个频道
    */
   off(event: string, callback: Callback) {
      if (event in this[BUS_MAP]) {
         let arr = this[BUS_MAP][event]
         for (let i = 0; i < arr.length; ++i) {
            if (arr[i] === callback)
               arr.splice(i, 1)
         }
      }
   }

   /**
    * 触发一个事件/发布一个频道的消息
    */
   emit(event: string, ...args: any) {
      if (event in this[BUS_MAP]) {
         for (let c of this[BUS_MAP][event]) {
            c(...args)
         }
      }
   }
}

