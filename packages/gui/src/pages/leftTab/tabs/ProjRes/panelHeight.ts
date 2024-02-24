import { computed, ref } from 'vue';

export function usePanelHeight() {
   const isDragerPanelShowed = ref(false)
   const referHeight = ref(0)
   const referHeightVBind = computed(() => referHeight.value + 'px')
   let referHeightMemo = 300
   const HEIGHT_THREDHOLD = 100

   function onDragerMousemove(e: MouseEvent) {
      const panel = <HTMLElement>e.target
      let height = panel.offsetHeight - e.offsetY
      referHeight.value = height < HEIGHT_THREDHOLD ? 0 : height
   }

   function onReferClick() {
      if (referHeight.value < HEIGHT_THREDHOLD)
         referHeight.value = referHeightMemo
      else {
         referHeightMemo = referHeight.value
         referHeight.value = 0
      }
   }

   return {
      isDragerPanelShowed,
      referHeightVBind,
      onDragerMousemove,
      onReferClick
   }
}
