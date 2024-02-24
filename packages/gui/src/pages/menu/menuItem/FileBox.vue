<script lang='ts' setup>
import { exec } from '@/boot/apis'
defineOptions({ name: 'FileBox' })
defineProps<{ label: string }>()
defineEmits(['file', "value", "update:value"])

function onFileClick() {
   exec<Record<string, any>>('dialog:open-file').then((res) => {
      if (res.status && res.data) {
      }
   })
}
</script>

<template>
   <div :class="$style.filebox" @click="onFileClick">
      <li>{{ label }}</li>
   </div>
</template>

<style scoped module lang='scss'>
.filebox {
   position: relative;
   z-index: auto;

   input {
      position: absolute;
      top: 0;
      left: 0;
      height: 0;
      width: 0;
   }
}
</style>
