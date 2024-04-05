<script lang='ts' setup>
import typeSvg from '@/asset/icons/type.svg?raw'
import { PanelParam, PanelType, usePanelState } from '@/states/panelList';
import { cloneTyped, ScopeRo } from '@ra2inier/core';
import { getPackageName, isReadonly } from './metaState';
import { reactiveComputed } from '@vueuse/core';
import { useCtxMenuState } from '@/states/ctxMenu';
import { useProjectStore } from '@/stores/projectStore';


const store = useProjectStore()
const ctxmenu = useCtxMenuState()
const panel = usePanelState()
const props = defineProps<{ scopes: Record<string, ScopeRo> }>()
const scopeView: Record<string, ScopeRo> = reactiveComputed(() => props.scopes)
function onSave(scope: ScopeRo) {
   const newOne = cloneTyped(scope, ScopeRo)
   store.saveScope(newOne)
   scopeView[newOne.key] = newOne
}

function openScopePanel(scope: ScopeRo) {
   const newOne = cloneTyped(scope, ScopeRo)
   const p = new PanelParam({
      label: scope.name,
      type: PanelType.ScopeEditor,
      init: newOne,
      readonly: isReadonly(scope)
   })
   if (!isReadonly(scope)) p.on('saved', onSave)
   panel.addPanel(p)
}

function onOpenClick(scope: ScopeRo) {
   openScopePanel(scope)
}

const vCtxmenu = ctxmenu.useCtxMenu({
   '新建类型'() {
      openScopePanel(store.addScope('NEW_SCOPE'))
   }
})

</script>


<template>
   <div :class="$style.scope" v-ctxmenu>
      <h2 class="list-item">
         <p v-svgicon="typeSvg" padding="15%"></p>
         <span>类型</span>
      </h2>
      <ul>
         <li class="list-item" v-for="(scope, key) of scopeView" :key="key" @dblclick="onOpenClick(scope)">
            <span>{{ getPackageName(scope) }}</span><span>/</span><span>{{ scope.name }}</span>
         </li>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
.scope {
   @import './meta.scss';
}
</style>
