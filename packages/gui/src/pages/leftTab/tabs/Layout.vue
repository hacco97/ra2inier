<script lang='ts' setup>
defineOptions({
   name: 'LeftTabsLayout',
})
</script>

<template>
   <div :class="$style.layout">
      <h2 :class="$theme['lefttab-header']">
         <div>
            <slot name="header"></slot>
         </div>
      </h2>
      <main>
         <section class="scroll">
            <div>
               <slot name="panel"></slot>
            </div>
         </section>
      </main>
   </div>
</template>

<style src="@css/lefttab.scss" scoped module="$theme" />
<style scoped lang='scss' module>
$header-height: line-height(normal);
$padding: align-size(large);

.layout {
   overflow: hidden;
   height: 100%;

   >h2 {
      position: relative;
      @include z-index(menu);
      height: $header-height;
      padding-left: $padding;

      >div {
         display: flex;
         align-items: center;
         justify-content: start;
         height: 100%;
      }
   }

   >main {
      position: relative;
      @include z-index(main);
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100% - $header-height);

      >section {
         min-width: 0px;
         height: 100%;
         overflow: hidden;
         overflow-y: auto;

         >div {
            height: 100%;
         }
      }
   }
}
</style>
