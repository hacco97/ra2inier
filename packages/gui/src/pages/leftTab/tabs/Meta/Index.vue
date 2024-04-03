<script lang='ts' setup>
import Layout from '../Layout.vue';
import DictView from './DictView.vue';
import MapperView from './MapperView.vue';
import ScopeView from './ScopeView.vue';
import SnippetView from './SnippetView.vue';
import Search from '../Search.vue';
import { provide } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
const store = useProjectStore()

defineOptions({ name: "Meta" })

provide('scopes', store.scopes)
provide('mappers', store.mappers)
provide('dictionary', store.dictionary)

</script>


<template>
   <Layout>
      <template #header>
         <div>辅助类管理</div>
      </template>
      <template #panel>
         <div :class="$style.metaview">
            <Search placeholder="搜索对象"></Search>
            <ScopeView :scopes="store.scopes" />
            <MapperView :mappers="store.mappers" />
            <DictView :dictionary="store.dictionary" />
            <SnippetView :dictionary="store.dictionary" />
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
