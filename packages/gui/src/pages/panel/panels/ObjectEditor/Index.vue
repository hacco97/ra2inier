<script lang='ts' setup>
import { ref, shallowReactive } from 'vue';

import checkSvg from '@/asset/icons/check.svg?raw';
import columnSvg from '@/asset/icons/column.svg?raw';
import commentSvg from '@/asset/icons/comment.svg?raw';
import delSvg from '@/asset/icons/delete.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import { PanelParam } from '@/states/panelList';
import { projectName } from '@/stores/projectStore';
import { fromRaw } from '@ra2inier/core';
import { FlexInput, LazyButton } from '@ra2inier/wc';

import HeaderLayout from '../HeaderLayout.vue';
import EditorView from './EditorView.vue';
import { EditorState } from './eidtorState';

defineOptions({ name: 'ObjectEditor' })
const props = defineProps<{ param: PanelParam }>()
const param = props.param
const state = shallowReactive(
   new EditorState(param.data, param.handler!)
)
const data = state.data

function onNameChange() {
   param.label = data.name
}

function onSaveClick() {
   state.save()
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
                     <em><flex-input v-model.lazy.trim="data.scope" placeholder="NullTypes" /></em><i></i>
                     <em>/</em><i @click="fi3?.focus()"></i>
                     <em><flex-input ref="fi3" v-model.lazy.trim="data.scope" placeholder="root" /></em>
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

<style scoped lang='scss' module >
$height: line-height(normal);

.editor {
   height: 100%;
   position: relative;
   z-index: 0;

   // 上部页面标题
   >h1 {
      height: $height;
      width: 100%;
      position: absolute;
      @include z-index(menu);

      >ul {
         display: flex;
         width: fit-content;
         height: 100%;
      }

      h2 {
         display: flex;
         flex-wrap: nowrap;
         height: 100%;
         margin-left: align-size(normal);
         align-items: center;
      }

      flex-input::part(input) {
         text-decoration: underline;
      }

      label {
         width: align-size(larger);
         height: 100%;
      }

      span {
         display: block;
         float: left;
         padding: 0 5px;
      }

      i {
         width: align-size(normal);
         height: 100%;
      }

      aside {
         display: flex;
         flex-wrap: nowrap;
         height: 100%;
         min-height: 0;
         align-items: center;
      }
   }

   footer {
      height: 300px;
      width: 100%;
   }
}

.buttons {
   em {
      width: align-size(large);
      height: 100%;
   }

   s {
      display: block;
      height: 100%;
      aspect-ratio: 1;
      margin: 0 align-size(tiny);
   }
}

.column {
   position: relative;
}

.column::after {
   content: attr(column);
   position: absolute;
   top: 0;
   right: - align-size(normal);
   width: align-size(large);
   height: align-size(large);
   text-align: center;
   border-radius: 50px;
   @include selection()
}
</style>
