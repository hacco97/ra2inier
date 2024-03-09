<script lang='ts' setup>
import ListView from '@/components/ListView.vue';
import { PanelParam } from '@/states/panelList';

const props = defineProps<{ param: PanelParam }>()

const list = ['123', '23', '132', '123']



 
</script>


<template>
   <div>
      <ListView :list />
   </div>


</template>

<style module scoped lang='scss'></style>
