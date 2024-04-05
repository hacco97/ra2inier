<script lang='ts' setup>
import mapperSvg from '@/asset/icons/mapper.svg?raw'
import { cloneTyped, MapperRo } from '@ra2inier/core';
import { isReadonly, getPackageName } from './metaState';
import { reactiveComputed } from '@vueuse/core';
import { useProjectStore } from '@/stores/projectStore';
import { useCtxMenuState } from '@/states/ctxMenu';
import { PanelParam, PanelType, usePanelState } from '@/states/panelList';

const store = useProjectStore()
const ctxmenu = useCtxMenuState()
const panel = usePanelState()

const props = defineProps<{ mappers: Record<string, MapperRo> }>()
const mapperView: Record<string, MapperRo> = reactiveComputed(() => props.mappers)

function onSave(data: MapperRo) {
   const newOne = cloneTyped(data, MapperRo)
   store.saveMapper(newOne)
   mapperView[newOne.key] = newOne
}

function openMapperPanel(mapper: MapperRo) {
   const newOne = cloneTyped(mapper, MapperRo)
   const readonly = isReadonly(mapper)
   const p = new PanelParam({
      label: mapper.name,
      type: PanelType.Mappers,
      init: newOne,
      readonly
   })
   if (!readonly) p.on('saved', onSave)
   panel.addPanel(p)
}

function onOpenMapper(mapper: MapperRo) {
   openMapperPanel(mapper)
}


const vCtxmenu = ctxmenu.useCtxMenu({
   '新建输出器'() {
      openMapperPanel(store.addMapper('NEW_MAPPER'))
   }
})

</script>


<template>
   <div :class="$style.mapper" v-ctxmenu>
      <h2 class="list-item">
         <p v-svgicon="mapperSvg" padding="15%"></p>
         <span>输出器</span>
      </h2>
      <ul>
         <li class="list-item" v-for="(mapper, key) in mapperView" @dblclick="onOpenMapper(mapper)" :key="key">
            <span>{{ getPackageName(mapper) }}</span><span>/</span><span>{{ mapper.name }}</span>
         </li>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
.mapper {
   @import './meta.scss';
}
</style>
