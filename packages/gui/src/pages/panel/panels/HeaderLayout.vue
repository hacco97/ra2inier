<script lang='ts' setup>

</script>


<template>
   <div :class="$style.panel">
      <!-- 头部标题 -->
      <h1 class="panel-header">
         <slot name="header"></slot>
      </h1>

      <!-- 中部info内容 -->
      <main class="scroll">
         <slot></slot>
         <footer tabindex="-1"></footer>
      </main>
   </div>
</template>

<style module scoped lang='scss'>
$height: line-height(normal);

.panel {
   position: relative;
   height: 100%;
   width: 100%;
   line-height: $height;

   h1 {
      position: absolute;
      @include z-index(panelnav);
      height: $height;
      width: 100%;
   }

   main {
      position: relative;
      @include z-index(main);
      padding-top: $height;
   }


   footer {
      height: clamp(400px, 30%, 600px);
   }
}
</style>
