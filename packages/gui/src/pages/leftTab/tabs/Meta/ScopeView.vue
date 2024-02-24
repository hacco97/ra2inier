<script lang='ts' setup>
import { useCtxMenu } from '@/states/ctxMenu';
import { addPanel, PanelType } from '@/states/panelList';
import { ScopeRo } from '@ra2inier/core';

// const scopes: Record<string, ScopeRo> = inject('scopes') ?? {}
const props = defineProps<{ scopes: Record<string, ScopeRo> }>()

function onOpenClick(scope: ScopeRo) {
   addPanel({
      label: scope.name,
      type: PanelType.ScopeEditor,
      data: scope
   })
}

// function onCtxOpenClick() {
//    if (currentTarget.value) {
//       addPanel({
//          label: currentTarget.value.name,
//          type: PanelType.ScopeEditor,
//          data: currentTarget.value
//       })
//    }
// }

// function onScopeContextmenu(e: MouseEvent) {
//    currentTarget.value = undefined
//    showScopeContextmenu(e, currentTarget.value)
// }

function onAddClick() {
   addNewScope()
}

function addNewScope() {
   const scope = new ScopeRo
   scope.name = 'NEW SCOPE'
   addPanel({
      label: 'SCOPE',
      type: PanelType.ScopeEditor,
      data: scope
   })

   return scope
}

const vCtxmenu = useCtxMenu({})

</script>


<template>
   <div class="local-scopeview" v-ctxmenu>
      <h2>Scope::对象类型</h2>
      <ul>
         <li class="list-item c-h-n" v-for="(scope, key) of scopes"
            :key="key" @dblclick="onOpenClick(scope)">
            <span>+</span> <span> {{ scope.name }}</span>
         </li>
      </ul>
   </div>
</template>

<style scoped lang='scss'>
.local-scopeview {
   $height: 25px;


   h2 {
      height: $height;
      line-height: $height;
   }
}
</style>
