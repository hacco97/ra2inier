<script lang='ts' setup>

</script>


<template>
   <div :class="$style.panel">
      <!-- 头部标题 -->
      <h1>
         <slot name="header"></slot>
      </h1>

      <!-- 中部info内容 -->
      <main class="scroll">
         <slot></slot>
         <footer></footer>
      </main>
   </div>
</template>

<style module scoped lang='scss'>
$height: line-height(normal);

.panel {
   position: relative;
   height: 100%;
   width: 100%;

   h1 {
      position: absolute;
      z-index: 1;
      height: $height;
      width: 100%;
   }

   main {
      padding-top: $height;
   }


   footer {
      height: max(40%, 400px);
   }
}
</style>
