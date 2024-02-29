<script lang='ts' setup>
import { useCtxMenu } from '@/states/ctxMenu';
import { addPanel, PanelType } from '@/states/panelList';
import { MapperRo } from '@ra2inier/core';

defineOptions({ name: 'MapperView' })

defineProps<{ mappers: Record<string, MapperRo> }>()

function onOpenMapper(mapper: MapperRo) {
   addPanel({
      label: mapper.name,
      type: PanelType.Mappers,
      data: mapper
   })
}

function onAddClick() {

}

const vCtxmenu = useCtxMenu({
   '添加输出文件'() {
      console.log('添加')

   }
})

</script>


<template>
   <div :class="$style.mapper" v-ctxmenu>
      <h2>Mapper::文件类型</h2>
      <ul>
         <li class="list-item c-h-n" v-for="(mapper, key) in mappers" @dblclick="onOpenMapper(mapper)" :key="key">
            <span>+</span><span>{{ mapper.name }}</span>
         </li>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
$padding-left: align-size(large);
$height: line-height(small);

.mapper {
   li {
      padding-left: $padding-left;
   }

   h2 {
      height: $height;
      line-height: $height;
   }
}
</style>
