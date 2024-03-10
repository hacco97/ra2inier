<script lang='ts' setup>
import { ref, watch } from 'vue';

import openSvg from '@/asset/icons/openDir.svg?raw';
import reloadSvg from '@/asset/icons/reload.svg?raw';
import rightSvg from '@/asset/icons/right.svg?raw';
import ListView, { IItem } from '@/components/dirty/ListView.vue';
import MapBox from '@/components/dirty/MapBox.vue';
import { projectInfo as info } from '@/stores/projectStore';
import { useGlobalPackages } from '@/stores/staticStore';
import { forIn, Reference } from '@ra2inier/core';
import { LazyButton, PopupBox } from '@ra2inier/wc';

defineOptions({ name: 'ProjectInfo' })

const globalPackages = useGlobalPackages()

const f = (x: Reference) => ({
   value: x.name,
   popup: createPopup(x),
   path: x.path
})

interface Item extends IItem {
   path: string
}

const list = ref<Partial<Item>[]>([])
watch(info, () => {
   list.value = info.value.references.map(f)
}, { immediate: true })

const localList = ref<Partial<Item>[]>([])
watch([globalPackages, list], () => {
   const tmp: Partial<Item>[] = []
   forIn(globalPackages, (name, path) => tmp.push({
      value: name,
      popup: createPopup({ path }),
      selected: true,
      path
   }))
   localList.value = tmp
}, { immediate: true })

function createPopup(x: any) {
   return `${x.url ? x.url + '\n' : ''}本地路径：${x.path}`
}

const listView = ref<InstanceType<typeof ListView>>()
const localView = ref<InstanceType<typeof ListView>>()

const isLocalShowed = ref(false)

function onFlushClick() {
   console.log(localView.value?.value)

}

function onListDelete(item: IItem, order: number) {
   const target = localList.value.find(x => x.value === item.value)
   if (target) target.selected = false
}

</script>


<template>
   <div :class="$style['project-info']" class="scroll">
      <li class="line"><span>项目名称：</span><span>{{ info.name }}</span></li>
      <li class="line"><span>项目作者：</span><span>{{ info.author }}</span></li>
      <li class="line"><span>目标环境：</span><span>{{ info.target }}</span></li>
      <ul>
         <ListView ref="listView" :list :check-box="false" @delete="onListDelete">
            <h2>
               <span>引用：</span>
               <s class="normal-button" v-svgicon="openSvg" padding="15%"></s>
               <s class="normal-button" @click="isLocalShowed = !isLocalShowed">
                  <popup-box>
                     <em class="folder" v-svgicon="rightSvg" padding="15%" :folded="!isLocalShowed"></em>
                     <span slot="pop" class="popup">从全局包添加</span>
                  </popup-box>
               </s>
               <lazy-button class="normal-button" @click="onFlushClick">
                  <s v-svgicon="reloadSvg" padding="15%"></s>
               </lazy-button>
            </h2>
            <template #footer>
               <main class="normal-rpanel" v-show="isLocalShowed">
                  <ListView ref="localView" :list="localList" :delete-button="false">
                     <h3><span>全局包：</span></h3>
                  </ListView>
               </main>
            </template>
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

   ul {
      height: fit-content;
      max-width: fit-content;
      padding: 0 $align;
   }

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

      >s,
      >lazy-button {
         flex: 0 0 auto;
         height: 0.9lh;
         aspect-ratio: 1;
         margin-right: $align;
      }

      em {
         display: block;
         height: 100%;
         aspect-ratio: 1;
      }
   }

   footer {
      height: clamp(400px, 50%, 600px);
   }
}
</style>
