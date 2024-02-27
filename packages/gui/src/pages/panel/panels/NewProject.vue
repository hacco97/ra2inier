<script lang='ts' setup>
import { ref } from 'vue';

import newSvg from '@/asset/icons/new.svg?raw';
import openDirSvg from '@/asset/icons/openDir.svg?raw';
import { openDir, useConfig } from '@/stores/config';
import { FlexInput, LazyButton } from '@ra2inier/wc';

const defaultPath = useConfig().DEFAULT_PROJECT_DIR + '\\new_project'
const name = ref('new_project')
const dir = ref(defaultPath)

async function onOpenClick() {
   const path = await openDir()
   path && (dir.value = path)
}


function onAddClick() {
   console.log('add click')

}



</script>


<template>
   <div :class="$style['new-project']" class="scroll">
      <main>
         <li class="line">
            <span>项目名称：</span>
            <flex-input v-model="name" placeholder="new_project"></flex-input>
         </li>
         <li class="line">
            <span>项目路径：</span>
            <flex-input v-model="dir" :placeholder="defaultPath"></flex-input>
            <lazy-button class="fore-button" @click="onOpenClick">
               <s v-svgicon="openDirSvg" padding="15%"></s>
            </lazy-button>
            <lazy-button class="fore-button" @click="onAddClick">
               <s v-svgicon="newSvg" padding="13%"></s>
            </lazy-button>
         </li>
      </main>
   </div>
</template>

<style module scoped lang='scss'>
.new-project {
   height: 100%;

   main {
      padding: 1em 0;
   }

   li {
      display: flex;
      vertical-align: middle;
      padding: 0 1em;

      >* {
         margin: 0 0.5ch;
      }
   }

   span {
      vertical-align: middle;
   }

   flex-input {
      min-height: 1em;
      text-decoration: underline;
   }

}
</style>
