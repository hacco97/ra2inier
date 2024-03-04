<script lang='ts' setup>
import { ref, watch } from 'vue';

import { loadingVersion, ProjectInfo, useProject } from '@/stores/projectStore';

defineOptions({ name: 'ProjectInfo' })
const project = useProject()


const info = ref(new ProjectInfo(project.value))

watch(loadingVersion, () => {
   info.value = new ProjectInfo(project.value)
})

</script>


<template>
   <div :class="$style['project-info']">
      <li class="line"><span>项目名称：</span><span>{{ info.name }}</span></li>
      <li class="line"><span>项目作者：</span><span>{{ info.author }}</span></li>
      <li class="line"><span>目标环境：</span><span>{{ info.target }}</span></li>
      <li><span>引用：</span><pre>{{ info.references }}</pre></li>
      <li class="line"><span>环境变量：</span></li>
      <li class="line"><span>构建方案：</span></li>
   </div>
</template>

<style lang='scss' module scoped>
.project-info {
   padding: align-size(large) 0;

   li {
      padding: 0 align-size(large);
   }
}
</style>
