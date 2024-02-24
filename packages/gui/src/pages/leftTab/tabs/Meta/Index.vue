<script lang='ts' setup>
import DictView from './DictView.vue';
import ScopeView from './ScopeView.vue';
import MapperView from './MapperView.vue';
import Layout from '../Layout.vue';
import { projectName, useAll } from '@/stores/projectStore';


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
         <div class="local-metaview">
            <li v-if="pName">当前项目::{{ pName }}</li>
            <i class="list-item"></i>
            <MapperView :mappers="all.mappers" />
            <i class="list-item"></i>
            <ScopeView :scopes="all.scopes" />
            <i class="list-item"></i>
            <DictView :dictionary="all.dictionary" />
         </div>
      </template>
   </Layout>
</template>

<style scoped lang='scss'>
.local-metaview {
   padding: 0 10px;

   i {
      display: block;
      height: 3ch;
      border-bottom: var(--color-line-dark) solid 1px;
      margin: 1ch 0;
   }
}
</style>
