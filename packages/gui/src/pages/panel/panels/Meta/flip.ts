import { computed, Directive, ref, watch, WatchStopHandle } from 'vue';

import { PanelParam } from '@/states/panelList';

export function useFilp(props: { param: PanelParam }, data: any) {
   const disabled = ref(true)
   const changed = ref(false)

   const submit = () => {
      if (!changed.value) return
      props.param.submit(data)
      changed.value = false
   }

   watch(() => props.param, () => {
      submit()
      props.param.on('before-closed', submit)
   }, { immediate: true })

   function onFlipClick() {
      disabled.value = !disabled.value
      if (changed.value) {
         props.param.save(data)
         changed.value = false
      }
   }

   function onChanged() {
      changed.value = true
   }

   let handle: WatchStopHandle

   const cantSave = () => (!disabled.value && !changed.value) + ''

   return {
      disabled,
      onChanged,
      onFlipClick,
      changed,
      vFlip: <Directive<HTMLElement, any>>{
         mounted(el) {
            el.addEventListener('click', onFlipClick)
            handle = watch([changed, disabled], () => {
               el.setAttribute('disabled', cantSave())
            }, { immediate: true })
         },
         unmounted() {
            if (handle) handle()
         }
      }
   }
}
