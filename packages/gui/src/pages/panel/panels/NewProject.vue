<script lang='ts' setup>
import { ref } from 'vue';

import newSvg from '@/asset/icons/new.svg?raw';
import openDirSvg from '@/asset/icons/openDir.svg?raw';
import { useConfigStore } from '@/stores/config';
import { FlexInput, LazyButton } from '@ra2inier/wc';
import HeaderLayout from './HeaderLayout.vue';
import ReferView from './ReferView.vue';
import { openDirectory } from '@/boot/file';
import { newProject } from '@/stores/projectStore';
import { PanelParam } from '@/states/panelList';

const { config } = useConfigStore()
const props = defineProps<{ param: PanelParam }>()
const param = props.param

const name = ref('new_project')
const defaultPath = config.DEFAULT_PROJECT_DIR + '/new_project'
const targetPath = ref(defaultPath)

function onNameInput() {
   setTimeout(() => {
      const id = targetPath.value.lastIndexOf('/')
      targetPath.value = targetPath.value.substring(0, id + 1)
         + (name.value || 'new_project')
   })
}

async function onOpenClick() {
   const path = await openDirectory()
   path && (targetPath.value = path[0])
}


function onAddClick() {
   newProject({ path: targetPath.value, name: name.value })

}
</script>


<template>
   <HeaderLayout :class="$style['new-project']">
      <template #header>
         <li>
            <h2>
               <em>{{ name }}</em>
               <em>
                  <lazy-button class="fore-button" @click="onAddClick">
                     <s v-svgicon="newSvg" padding="13%"></s>
                  </lazy-button>
               </em>
            </h2>
         </li>
      </template>
      <template #default>
         <main>
            <li>
               <h2>
                  <span>项目名称：</span>
                  <flex-input v-model="name" @input="onNameInput" class="normal-rpanel"
                     placeholder="new_project"></flex-input>
               </h2>
            </li>
            <li>
               <h2>
                  <span>项目路径：</span>
                  <lazy-button class="fore-button" @click="onOpenClick">
                     <s v-svgicon="openDirSvg" padding="15%"></s>
                  </lazy-button>
               </h2>
               <div><flex-input class="normal-rpanel" v-model="targetPath" :placeholder="defaultPath"></flex-input>
               </div>
            </li>
            <li>
               <ReferView />
            </li>
         </main>
      </template>
   </HeaderLayout>
</template>

<style module scoped lang='scss'>
$align: align-size(normal);

.new-project {
   height: 100%;

   main {
      padding: $align 0;
   }

   li {
      padding: 0 $align;
   }

   h2 {
      display: flex;
      align-items: center;
      height: 1lh;
   }

   em {
      height: 100%;
      margin: align-size(large);
   }

   lazy-button {
      margin-right: align-size(small);
   }

   div {
      height: 1lh;
   }

   span {
      vertical-align: middle;
   }

   flex-input {
      min-height: $align;
      text-decoration: underline;
      padding: 0 align-size(normal);
   }
}
</style>
