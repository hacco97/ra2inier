<script lang='ts' setup>
import { ref, shallowReactive } from 'vue';

import checkSvg from '@/asset/icons/check.svg?raw';
import columnSvg from '@/asset/icons/column.svg?raw';
import commentSvg from '@/asset/icons/comment.svg?raw';
import delSvg from '@/asset/icons/delete.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import { PanelParam } from '@/states/panelList';
import { projectName } from '@/stores/projectStore';
import { FlexInput, LazyButton } from '@ra2inier/wc';

import HeaderLayout from '../HeaderLayout.vue';
import EditorView from './EditorView.vue';
import { EditorState } from './eidtorState';

defineOptions({ name: 'ObjectEditor' })
const props = defineProps<{ param: PanelParam }>()
const param = props.param
const state = shallowReactive(
   new EditorState(param.data)
)
const data = state.data

function onNameChange() {
   param.label = data.name
}

function submit() {
   const value = state.value()
   param.data = value
}
param.on('before-closed', submit)

function onSaveClick() {
   submit()
   param.emit('save', param.data)
}


function ondeleteClick() {
   state.removeSelected()
}

// 注释添加逻辑
function onCommentInsert() {
   state.emit('comment-insert-require')
}

const pName = projectName

function onColumnClick() {
   state.columnCount = (state.columnCount + 1) % 5
}

const fi3 = ref<HTMLElement>()


function onCheckClick() {
   state.validateWordById(0)
}
</script>


<template>
   <HeaderLayout>
      <template #header>
         <div :class="$style.editor" tabindex="-1">
            <!-- 头部 -->
            <h1 class="scrollx" v-scrollx>
               <ul>
                  <h2>
                     <em>./</em><span>{{ pName }}</span><em>/</em>
                     <i></i><flex-input v-model.lazy.trim="data.name" @change="onNameChange" placeholder="OBJECT" />
                     <em>.</em>
                     <flex-input v-model.lazy.trim="data.scope" placeholder="NullTypes" /><i></i>
                     <em>/</em><i @click="fi3?.focus()"></i>
                     <flex-input ref="fi3" v-model.lazy.trim="state.currentChild" placeholder="root" />
                  </h2>
                  <label @click="fi3?.focus()"></label>
                  <label></label>
                  <aside :class="$style.buttons">
                     <lazy-button @click="onSaveClick">
                        <s title="保存(Ctrl + S)" v-svgicon="saveSvg" class="fore-button"></s>
                     </lazy-button>
                     <lazy-button @click="onCheckClick">
                        <s title="检查(Ctrl + A)" v-svgicon="checkSvg" class="fore-button"></s>
                     </lazy-button>
                     <s @click="onCommentInsert" title="注释(Ctrl + /)" padding="20%" v-svgicon="commentSvg"
                        class="fore-button"></s>
                     <s title="分栏" padding="15%" v-svgicon="columnSvg" class="fore-button" :column="state.columnCount"
                        :class="$style.column" @click="onColumnClick"></s>
                     <em></em>
                     <lazy-button @click="ondeleteClick">
                        <s title="删除(Delete)" v-svgicon="delSvg" class="fore-button"></s>
                     </lazy-button>
                  </aside>
               </ul>
            </h1>
         </div>
      </template>

      <template #default>
         <!-- 编辑视图 -->
         <EditorView :state="state" />
      </template>
   </HeaderLayout>
</template>

<style scoped src="./editor.scss" module></style>
