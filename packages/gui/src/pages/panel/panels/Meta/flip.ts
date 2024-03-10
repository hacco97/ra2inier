import { Directive, ref, watch, WatchStopHandle } from 'vue';

import { PanelParam } from '@/states/panelList';

export function useFilp(param: PanelParam, data: any) {
   const disabled = ref(true)
   const changed = ref(true)
   param.result = data

   function onFlipClick(flag: boolean) {
      if (flag) disabled.value = false
      else {
         disabled.value = true
         if (param.changed) {
            param.emit('save', data)
            param.changed = false
            changed.value = true
         }
      }
   }

   function onChanged() {
      console.log(123)

      param.changed = true
      changed.value = true
   }

   let handle: WatchStopHandle

   return {
      disabled,
      onChanged,
      onFlipClick,
      changed,
      vFlip: <Directive<HTMLElement, any>>{
         mounted(el) {
            el.addEventListener('click', () => onFlipClick(disabled.value))
            handle = watch(changed, () => {
               el.setAttribute('disabled', !changed.value + '')
            })
         },
         unmounted() {
            if (handle) handle()
         }
      }
   }
}
