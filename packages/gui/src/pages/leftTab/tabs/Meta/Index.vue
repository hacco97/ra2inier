<script lang='ts' setup>
import { allOfPackages, projectName } from '@/stores/projectStore';
import Layout from '../Layout.vue';
import DictView from './DictView.vue';
import MapperView from './MapperView.vue';
import ScopeView from './ScopeView.vue';
import SnippetView from './SnippetView.vue';
import Search from '../Search.vue';


defineOptions({ name: "Meta" })

const pName = projectName
const all = allOfPackages

</script>


<template>
   <Layout>
      <template #header>
         <div>辅助类管理</div>
      </template>
      <template #panel>
         <div :class="$style.metaview">
            <Search placeholder="搜索对象"></Search>
            <ScopeView :scopes="all.scopes" />
            <MapperView :mappers="all.mappers" />
            <DictView :dictionary="all.dictionary" />
            <SnippetView :dictionary="all.dictionary" />
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
