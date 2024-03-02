<script lang='ts' setup>
import { shallowReactive } from 'vue';

import { useCtxMenu } from '@/states/ctxMenu';
import { addPanel, PanelParam, PanelType } from '@/states/panelList';
import { addMapper, saveMapper } from '@/stores/projectStore';
import { setMapper } from '@/stores/projectStore/boot';
import { cloneTyped, MapperRo } from '@ra2inier/core';

import { isReadonly, queryPkgNameByKey } from './metaState';

defineOptions({ name: 'MapperView' })

const props = defineProps<{ mappers: Record<string, MapperRo> }>()
const mapperView: Record<string, MapperRo> = shallowReactive(props.mappers)

function onSave(data: MapperRo) {
   const newOne = cloneTyped(data, MapperRo)
   saveMapper(newOne)
   mapperView[newOne.key] = newOne
}

function openMapperPanel(mapper: MapperRo) {
   const newOne = cloneTyped(mapper, MapperRo)
   const p = new PanelParam({
      label: mapper.name,
      type: PanelType.Mappers,
      data: newOne,
      readonly: isReadonly(mapper)
   })
   if (!isReadonly(mapper)) {
      p.on('closed', onSave)
      p.on('save', onSave)
   }
   addPanel(p)
}

function onOpenMapper(mapper: MapperRo) {
   openMapperPanel(mapper)
}

const vCtxmenu = useCtxMenu({
   '新建输出器'() {
      openMapperPanel(addMapper('NEW_MAPPER'))
   }
})

</script>


<template>
   <div :class="$style.mapper" v-ctxmenu>
      <h2>Mapper::文件类型</h2>
      <ul>
         <li class="list-item" v-for="(mapper, key) in mapperView" @dblclick="onOpenMapper(mapper)" :key="key">
            <span>{{ queryPkgNameByKey(mapper.package) }}</span><span>&gt;</span><span>{{ mapper.name }}</span>
         </li>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
.mapper {
   @import './meta.scss';
}
</style>
