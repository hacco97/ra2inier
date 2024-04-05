<script lang='ts' setup>
const props = defineProps<{}>()

</script>


<template>
   <div :class="$style.space">
      <li></li>
      <hr>
   </div>
</template>

<style module scoped lang='scss'>
div.space {
   li {
      height: 0.4lh;
   }

   height: 0.8lh;

   hr {
      display: block;
      width: 80%;
      height: 1px;
      background-color: line-color(normal);
   }
}
</style>
