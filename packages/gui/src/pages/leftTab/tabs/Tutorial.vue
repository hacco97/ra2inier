<script lang='ts' setup>
import LeftTabLayout from './Layout.vue'
defineOptions({
   name: 'Tutorial',
   components: { LeftTabLayout },
})

</script>


<template>
   <LeftTabLayout>
      <template #header>
         <div>教程浏览</div>
      </template>
      <template #panel>
         <ul>
            <li>12</li>
            <li>12</li>
            <li>12</li>
            <li>12</li>
            <li>12</li>
            <li>12</li>
            <li>12</li>
            <li>12</li>
            <li>12</li>
            <li>12</li>
         </ul>
      </template>
   </LeftTabLayout>
</template>

<style scoped lang='scss'></style>
