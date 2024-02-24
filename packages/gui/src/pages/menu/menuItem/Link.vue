<script lang='ts' setup>
defineOptions({ name: 'Name' })


defineProps<{ label: string, value: string }>()

</script>


<template>
   <div>
      <a :href="value" target="_blank" tabindex="-1">
         {{ label }}
      </a>
   </div>
</template>

<style scoped lang='scss'></style>
