<script lang='ts' setup>
import { projectName, useAll } from '@/stores/projectStore';

import Layout from '../Layout.vue';
import DictView from './DictView.vue';
import MapperView from './MapperView.vue';
import ScopeView from './ScopeView.vue';

defineOptions({ name: "Meta" })

const pName = projectName
const all = useAll()

</script>


<template>
   <Layout>
      <template #header>
         <div>辅助类管理</div>
      </template>
      <template #panel>
         <div :class="$style.metaview">
            <li v-if="pName">当前项目::{{ pName }}</li>
            <i></i>
            <MapperView :mappers="all.mappers" />
            <i></i>
            <ScopeView :scopes="all.scopes" />
            <i></i>
            <DictView :dictionary="all.dictionary" />
         </div>
      </template>
   </Layout>
</template>

<style scoped lang='scss' module>
.metaview {
   i {
      display: block;
      height: align-size(large);
      border-bottom: var(--color-line-dark) solid 1px;

   }
}
</style>
