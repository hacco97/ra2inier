<script lang='ts' setup>
import { computed, onMounted, ref, watch } from 'vue';

import openSvg from '@/asset/icons/openDir.svg?raw';
import reloadSvg from '@/asset/icons/reload.svg?raw';
import rightSvg from '@/asset/icons/right.svg?raw';
import ListView from '@/components/ListView.vue';
import MapBox from '@/components/MapBox.vue';
import { projectInfo as info } from '@/stores/projectStore';
import { useGlobalPackages } from '@/stores/staticStore';
import { ProjectInfo } from '@ra2inier/core';

defineOptions({ name: 'ProjectInfo' })

const globalPackages = useGlobalPackages()

const list = computed(() => info.value.references.map(x => x.name))
const popups = computed(() => info.value.references.map(x => {
   const url = x.url ? `仓库链接：${x.url}\n` : ''
   return `${url}本地路径：${x.path}`
}))


const localList = computed(() => {
   return Object.keys(globalPackages)
})
const localListPopups = computed(() => {
   return Object.values(globalPackages)
})

const listView = ref<InstanceType<typeof ListView>>()
onMounted(() => {
   console.log(listView.value)
   console.log(listView.value!.value)
})

const isLocalShowed = ref(false)
function onAddClick() {

}

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
               <s class="normal-button" v-svgicon="openSvg" padding="15%"></s>
               <s class="normal-button" v-svgicon="reloadSvg" padding="15%"></s>
               <i></i>
               <s class="normal-button folder" v-svgicon="rightSvg" padding="15%"
                  @click="isLocalShowed = !isLocalShowed" :folded="!isLocalShowed"></s>
            </h2>
            <main class="normal-rpanel" v-show="isLocalShowed">
               <ListView :list="localList" :popups="localListPopups" :delete-button="false">
                  <h3><span>本地包：</span></h3>
               </ListView>
            </main>
         </ListView>
      </ul>
      <ul class="line">
         <p><span>环境变量：</span></p>
         <MapBox :map="{}"></MapBox>
      </ul>
      <li class="line"><span>构建方案：</span></li>
      <footer></footer>
   </div>
</template>

<style lang='scss' module scoped>
$height: line-height(normal);
$align: align-size(normal);

.project-info {
   position: relative;
   z-index: 0;
   padding: $align 0;
   line-height: $height;

   ul,
   li {
      padding: 0 $align;
      height: 1lh;
   }

   main {
      padding: 0 $align;
   }

   p {
      height: 1lh;
   }

   h2 {
      display: flex;
      align-items: center;

      i {
         flex: 1;
         width: 1em;
      }

      s {
         flex: 0 0 auto;
         height: 0.9lh;
         aspect-ratio: 1;
         margin-left: align-size(small);
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
