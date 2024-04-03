<script lang='ts' setup>
import { inject, Ref } from 'vue';
import { Dialog, DialogType, useDialogState } from '@/states/dialog';
import { FootTabType, useFoottabState } from '@/states/footTabList';

const foottab = useFoottabState()
const dialogs = useDialogState()
// foottab的自定义按钮逻辑
const mounted = <Ref<boolean>>inject('foottab-mounted')

function onFileChange(e: Event, dialog: Dialog) {
   const input = e.target as HTMLInputElement
   dialog.res = input.files ? input.files[0].path : ''
}

</script>


<template>
   <div>
      这里是对话框
      <ul>
         <li v-for="dialog in dialogs.list">
            <p><span> {{ dialog.question }}</span></p>
            <template v-if="dialog.type === DialogType.askStr">
               <p>
                  <span><input type="text" v-model="dialog.res" /></span>
                  <span @click="dialog.callback(dialog.res)">确认</span>
               </p>
            </template>
            <template v-else-if="dialog.type === DialogType.askFile">
               <p>
                  <span><input type="file" @change="onFileChange($event, dialog)" /></span>
                  <span @click="dialog.callback(dialog.res)">确认</span>
               </p>
            </template>
            <template v-else>
               <p><span @click="dialog.callback(true)">是</span>::<span @click="dialog.callback(false)">否</span></p>
            </template>
         </li>
      </ul>
   </div>
   <Teleport v-if="mounted" to="#foottab-tools" :disabled="foottab.selected.type !== FootTabType.Dialog">
      <p>1</p>
      <p>2</p>
      <p>3</p>
   </Teleport>
</template>

<style scoped lang="scss" module></style>

<style scoped lang='scss'>
#foottab-tools {
   height: 100%;

   p {
      display: block;
      height: 100%;
      aspect-ratio: 1;
      margin: 0 align-size(tiny);

      background-color: red;
   }
}
</style>
