<script lang='ts' setup>
import { all, projectName } from '@/stores/projectStore';

import Layout from '../Layout.vue';
import DictView from './DictView.vue';
import MapperView from './MapperView.vue';
import ScopeView from './ScopeView.vue';

defineOptions({ name: "Meta" })

const pName = projectName


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
   li {
      padding-left: align-size(normal);
   }

   i {
      display: block;
      height: align-size(large);
   }
}
</style>
