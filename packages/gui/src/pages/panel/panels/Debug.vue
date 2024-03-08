<script lang='ts' setup>
import ListView from '@/components/ListView.vue';
const props = defineProps<{}>()

const list = ['123', '23', '132', '123']

</script>


<template>
   <div>
      <ListView :list />
   </div>
</template>

<style module scoped lang='scss'></style>