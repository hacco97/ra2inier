<script lang='ts' setup>
import { computed, onMounted, ref, watch } from 'vue';

import addSvg from '@/asset/icons/openDir.svg?raw';
import reloadSvg from '@/asset/icons/reload.svg?raw';
import ListView from '@/components/ListView.vue';
import { loadingVersion, ProjectInfo, useProject } from '@/stores/projectStore';
import { useGlobalPackages } from '@/stores/staticStore';
import { PopupBox } from '@ra2inier/wc';

defineOptions({ name: 'ProjectInfo' })
const project = useProject()


const info = ref(new ProjectInfo(project.value))
const globalPackages = useGlobalPackages()

watch(loadingVersion, () => {
   info.value = new ProjectInfo(project.value)
})

const list = computed(() => info.value.references.map(x => x.name))
const popups = computed(() => info.value.references.map(x => {
   const url = x.url ? `仓库链接：${x.url}\n` : ''
   return `${url}本地路径：${x.path}`
}))

const listView = ref<InstanceType<typeof ListView>>()
onMounted(() => {
   console.log(listView.value)
   console.log(listView.value!.value)
})

</script>


<template>
   <div :class="$style['project-info']" class="scroll">
      <li class="line"><span>项目名称：</span><span>{{ info.name }}</span></li>
      <li class="line"><span>项目作者：</span><span>{{ info.author }}</span></li>
      <li class="line"><span>目标环境：</span><span>{{ info.target }}</span></li>
      <ul>
         <ListView ref="listView" :list :popups :check-box="false">
            <h2>
               <span>引用：</span>
               <s class="normal-button" v-svgicon="addSvg" padding="15%"></s>
               <s class="normal-button" v-svgicon="reloadSvg" padding="15%"></s>
            </h2>
            <main>
               <ListView :list="['23', '43', '34']" :delete-button="false"></ListView>
            </main>
            <template #footer>
               <ol>
                  <p v-for="item in globalPackages">
                     <popup-box>
                        <span>{{ item }}</span>
                        <span></span>
                     </popup-box>
                  </p>
               </ol>
            </template>
         </ListView>
      </ul>
      <li class="line"><span>环境变量：</span></li>
      <li class="line"><span>构建方案：</span></li>
      <footer></footer>
   </div>
</template>

<style lang='scss' module scoped>
$height: line-height(normal);
$align: align-size(normal);

.project-info {
   padding: $align 0;
   line-height: $height;

   ul,
   li {
      padding: 0 $align;

      height: 1lh;
   }

   p {
      height: 1lh;
   }

   h2 {
      display: flex;
      align-items: center;


      s {
         display: inline-block;
         line-height: $height;
         height: 1lh;
         aspect-ratio: 1;
         margin: 0 align-size(small);
      }
   }


   ul {
      height: fit-content;
      max-width: fit-content;
   }

   footer {
      height: clamp(400px, 50%, 600px);
   }

}
</style>
