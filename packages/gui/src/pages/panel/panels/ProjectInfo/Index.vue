<script lang='ts' setup>
import { ref } from 'vue';
import { projectInfo as info, loadLocalPackage, loadPackage } from '@/stores/projectStore';
import openSvg from '@/asset/icons/openDir.svg?raw';
import reloadSvg from '@/asset/icons/reload.svg?raw';
import githubSvg from '@/asset/icons/github.svg?raw';
import copySvg from '@/asset/icons/copy.svg?raw';
import rightSvg from '@/asset/icons/right.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import submitSvg from '@/asset/icons/submit.svg?raw';
import MapBox from '@/components/dirty/MapBox.vue';
import ListView from '@/components/ListView.vue';
import { LazyButton, PopupBox, FlexInput } from '@ra2inier/wc';
import HeaderLayout from '../HeaderLayout.vue'
import { ReferItem, createReferList } from './state';
import { Reference } from '@ra2inier/core';
import { openDirectory } from '@/boot/apis';
import { useDisabled } from '@/hooks/disabledFn'
import { IItem } from '@/components/ListViewState';

defineOptions({ name: 'ProjectInfo' })

const { referList, localList, addRefer, getReferMap, deleteRefer } = createReferList()
const isLocalShowed = ref(false)
const newPath = ref('')
const newUrl = ref('')
// const listView = ref<InstanceType<typeof ListView>>()
// const localView = ref<InstanceType<typeof ListView>>()

function onReferDelete(item: IItem, order: number) {
   const i = <ReferItem>item
   deleteRefer(i)
}

function onLocalSelect(item: IItem, order: number) {
   const target = localList.value.find(x => x.key === item.key)!
   if (item.selected) {
      addRefer(target)
   } else {
      referList.value = referList.value.filter(x => x.key !== item.key)
   }
   target.selected = item.selected
}

const [onFlushClick] = useDisabled(async () => {
   // 获取需要添加的包
   const map = getReferMap()
   await loadPackage(map)
})

async function onOpenClick() {
   const dirs = <string[]>await openDirectory()
   console.log(dirs)
   const loaded = await loadLocalPackage(dirs)
   console.log(loaded)
}

async function onCopyClick() {
   const text = await navigator.clipboard.readText()
   newUrl.value = text.replaceAll('\n', '')
}


async function onLocalSubmitClick() {
   const loaded = await loadLocalPackage([newPath.value])
   console.log(loaded)

}

function onRemoteSubmitClick() {

}

</script>


<template>
   <HeaderLayout :class="$style['project-info']">
      <template #header>
         <h2 :class="$style.header">
            <span>{{ info.name }}</span>
            <lazy-button class="normal-button" @click="onFlushClick">
               <s v-svgicon="saveSvg" padding="15%"></s>
            </lazy-button>
         </h2>
      </template>
      <template #default>
         <li class="line"><span>项目名称：</span><span>{{ info.name }}</span></li>
         <li class="line"><span>项目作者：</span><span>{{ info.author }}</span></li>
         <li class="line"><span>目标环境：</span><span>{{ info.target }}</span></li>
         <ul>
            <ListView :list="referList" :check-box="false" @delete="onReferDelete">
               <h2>
                  <span>引用：</span>
                  <s class="normal-button" @click="isLocalShowed = !isLocalShowed">
                     <popup-box>
                        <em class="folder" v-svgicon="rightSvg" padding="15%" style="width: 100%;"
                           :folded="!isLocalShowed"></em>
                        <span slot="pop" class="popup">添加引用</span>
                     </popup-box>
                  </s>
                  <lazy-button class="normal-button" @click="onFlushClick">
                     <popup-box>
                        <em v-svgicon="reloadSvg" padding="15%"></em>
                        <span slot="pop" class="popup">刷新引用</span>
                     </popup-box>
                  </lazy-button>
               </h2>
            </ListView>
            <main class="normal-rpanel" v-show="isLocalShowed">
               <ListView v-if="localList.length" :list="localList" :delete-button="false" @select="onLocalSelect">
                  <h3><span>从内置导入：</span></h3>
               </ListView>
               <div v-else>没有找到内置包</div>
               <h3>
                  <span>从本地导入：</span>
                  <flex-input v-model="newPath" class="fore-input"></flex-input>
                  <s class="normal-button" v-svgicon="submitSvg" padding="15%" @click="onLocalSubmitClick"></s>
                  <s class="normal-button" v-svgicon="openSvg" padding="15%" @click="onOpenClick"></s>
               </h3>
               <h3>
                  <span>从远程导入：</span>
                  <flex-input v-model="newUrl" class="fore-input"></flex-input>
                  <s class="normal-button" v-svgicon="submitSvg" padding="15%" @click="onRemoteSubmitClick"></s>
                  <s v-svgicon="copySvg" class="normal-button" padding="15%" @click="onCopyClick"></s>
                  <a href="https://github.com/" class="normal-button"><span v-svgicon="githubSvg"></span></a>
               </h3>
            </main>
         </ul>
         <ul class="line">
            <p><span>环境变量：</span></p>
            <MapBox :map="{}"></MapBox>
         </ul>
         <li class="line"><span>构建方案：</span></li>
      </template>
   </HeaderLayout>
</template>

<style lang='scss' module scoped>
$height: line-height(normal);
$align: align-size(normal);

.header {
   span {
      margin: 0 align-size(large);
   }
}

.project-info {
   position: relative;
   z-index: 0;
   line-height: $height;
   text-wrap: nowrap;

   ul {
      height: fit-content;
      max-width: fit-content;
      padding: 0 $align;
   }

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

      em {
         display: block;
         height: 100%;
         aspect-ratio: 1;
      }

      >* {
         margin-right: $align;
      }
   }

   s,
   a,
   lazy-button {
      flex: 0 0 auto;
      height: 1lh;
      aspect-ratio: 1;
   }

   popup-box {
      display: block;
      width: 100%;
      height: 100%;
   }

   main {
      padding: 0 $align;


      h3 {
         display: flex;
         height: 1lh;
      }

      h3>* {
         margin-right: $align;
      }
   }


   flex-input {
      display: block;
      height: 1lh;
      min-width: 4em;
   }
}
</style>
