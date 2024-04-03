import { EventEmitter } from "@ra2inier/core"

// Event bus，全局事件订阅逻辑
class GlobalEmitter extends EventEmitter {
   onBack: EventEmitter['on'] = (event, callback, busId?) => {
      super.on.call(this, 'backend::' + event, callback, busId)
   }

   offBack: EventEmitter['off'] = (event, callback) => {
      super.off.call(this, 'backend::' + event, callback)
   }
}

function createGlobalEvent() {
   const globalEvent = new GlobalEmitter
   window.eApi.on('event-from-backend', (ev, channel: string, data: Record<string, any>) => {
      globalEvent.emit(channel, data)
   })

   return globalEvent
}

export const globalEvent = createGlobalEvent()



