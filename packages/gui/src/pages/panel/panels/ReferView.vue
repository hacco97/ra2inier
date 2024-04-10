<script lang='ts' setup>
import openSvg from '@/asset/icons/openDir.svg?raw';
import githubSvg from '@/asset/icons/github.svg?raw';
import copySvg from '@/asset/icons/copy.svg?raw';
import submitSvg from '@/asset/icons/submit.svg?raw';
import ListView from '@/components/ListView.vue';
import { FlexInput } from '@ra2inier/wc';
import { FileLink } from '@/components/FileLink';
import { useFolder } from '@/hooks/folder';
import { ReferItem } from '@/stores/projectStore';
import { downloadPackage, openDirectory, readPackageDir } from '@/boot/apis';
import { reactive, ref } from 'vue';
import { Package, Reference, UniqueObject, fromRaw, isEmptyObject } from '@ra2inier/core';
import { IItem } from '@/components/ListViewState';
import { ReferViewState, useLocalList } from './ReferViewState'

interface Prop {
   state: ReferViewState,
   folded?: boolean
}
const props = defineProps<Prop>()
defineExpose({
   get value() { return getReferMap() }
})
const { references, deleteRefer, addRefer, getReferMap } = props.state
const localList = reactive(useLocalList(references))
const newPath = ref('')
const newUrl = ref('')

function onReferDelete(item: IItem) {
   deleteRefer(<ReferItem>item)
   const target = localList.value.find(x => item.key === x.key)
   if (target) target.selected = false
}

function onLocalSelect(item: IItem) {
   const target = localList.value.find(x => x.key === item.key)!
   if (item.selected) { addRefer(target) }
   else { deleteRefer(target) }
   target.selected = item.selected
}

const loadPath = async (paths: string[]) => {
   const loaded = await readPackageDir(paths)
   for (const pkg of loaded) {
      const tmp = fromRaw(pkg, Package)
      addRefer({
         key: tmp.key,
         value: tmp.fullname,
         path: pkg.path,
         detail: '未加载',
         version: pkg.version
      })
   }
   return !isEmptyObject(loaded)
}

/**
 * 本地导入引用逻辑
 */
async function onOpenClick() {
   const dirs = <string[]>await openDirectory()
   if (!dirs || !dirs[0]) return
   loadPath(dirs)
}
function onLocalSubmitClick() {
   loadPath([newPath.value])
}

/**
 * 从远程到日引用逻辑
 */
async function onCopyClick() {
   const text = await navigator.clipboard.readText()
   newUrl.value = text.replaceAll('\n', '')
   const refer = new Reference({
      name: Math.random() + '',
      url: newUrl.value,
   })
   const downloaded = await downloadPackage([refer])
   console.log(downloaded)
}

function onRemoteSubmitClick() {

}

const { folded: isLocalFolded, vFolder } = useFolder(undefined, props.folded)
</script>


<template>
   <ul :class="$style.refer">
      <ListView :list="references" :check-box="false" @delete="onReferDelete">
         <template #default>
            <h2>
               <b v-folder>&gt;</b>
               <span @click="isLocalFolded = !isLocalFolded">引用：</span>
            </h2>
         </template>
         <template #popup="item">
            <div>
               <p>
                  <span>更新时间：</span>
                  <span>{{ UniqueObject.getVString(item.version) }}</span>
               </p>
               <p>
                  <span>本地路径：</span>
                  <file-link style="height: fit-content;" :path="item.path" class="link">
                     {{ item.path || '?' }}
                  </file-link>
               </p>
               <p>
                  <span>仓库链接：</span>
                  <a :href="item.url" class="link">
                     {{ (item.url && item.url.startsWith('https://github.com')) ? item.url : '?' }}
                  </a>
               </p>
            </div>
         </template>
      </ListView>
      <main class="normal-rpanel" v-show="!isLocalFolded">
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
</template>

<style module scoped lang='scss'>
$align: align-size(normal);

.refer {
   ul {
      height: fit-content;
      max-width: fit-content;
      padding: 0 $align;
   }

   p {
      height: 1lh;
   }

   h2 {
      display: flex;
      align-items: center;
   }

   s,
   a,
   lazy-button {
      flex: 0 0 auto;
      height: 1lh;
      aspect-ratio: 1;
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
      display: inline-block;
      height: 1lh;
      min-width: 4em;
   }
}
</style>
