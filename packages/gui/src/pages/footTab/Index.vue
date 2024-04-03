<script lang="ts" setup>
import { KeepAlive, onMounted, provide, ref } from 'vue';
import arrowDown from '@/asset/icons/arrowDown.svg?raw';
import arrowUp from '@/asset/icons/arrowUp.svg?raw';
import minSvg from '@/asset/icons/min.svg?raw';
import fix from '@/asset/icons/fix.svg?raw';
import Dialog from './tabs/Dialog.vue';
import Message from './tabs/Message.vue';
import Output from './tabs/Output.vue';
import Recycle from './tabs/Recycle.vue';
import { useLayoutState } from '@/states/layout';
import { FootTab, useFoottabState } from '@/states/footTabList';

defineOptions({
   name: 'FootTab',
   components: { Dialog, Output, Message, Recycle }
})

defineEmits(['toggleTab'])

const layout = useLayoutState()
const foottab = useFoottabState()

const draging = ref(<Readonly<FootTab>>foottab.footTabList[0])

//选项卡开启与关闭
function onTabClick(tab: FootTab) {
   const { footTabSize } = layout
   if (foottab.selected.id === tab.id) {
      if (footTabSize.height <= 25) {
         footTabSize.height = 300
      } else {
         footTabSize.min()
      }
   }
   foottab.selectFootTab(tab)
}

//选项卡可拖动的逻辑
const onTabDragStart = function (e: DragEvent, tab: FootTab) {
   draging.value = tab
   e.dataTransfer?.setData('foot_tab', '3')
   e.dataTransfer!.effectAllowed = 'move'
   e.dataTransfer!.dropEffect = 'move'
}

const onTabDrop = function (e: DragEvent, tab: FootTab) {
   const { footTabList } = foottab

   // TODO: 有副作用，等待更改
   if (!e.dataTransfer?.getData('foot_tab')) return
   if (draging.value?.id === tab.id) return
   let d = draging.value.order
   let order = tab.order
   if (d === order) return
   else if (d > order) {
      for (let i of footTabList) {
         if (i.order < d && i.order >= order) {
            // i.order++
         } else if (i.order === d) {
            // i.order = order
         }
      }
   }
   else {
      for (let i of footTabList) {
         if (i.order > d && i.order <= order) {
            // i.order--
         } else if (i.order === d) {
            // i.order = order
         }
      }
   }
}


function onUpClick() {
   layout.footTabSize.max()
}

function onDownClick() {
   layout.footTabSize.min()
}

const isFixSelected = ref(false)

function onFocusout() {
   layout.footTabSize.active = false
   if (isFixSelected.value) return
   setTimeout(layout.tryUnFocusFoottab, 20)
}

// TODO: 待更新
// const focusHandle = ref<HTMLElement>()
// layout.footTabSize.on('resized', () => {
//    focusHandle.value?.focus()
// })

// 给子组件提供通知，启动Teleport的渲染
const mounted = ref(false)
provide('foottab-mounted', mounted)
onMounted(() => { mounted.value = true })
</script>

<template>
   <div id="foottab" ref="focusHandle" :class="$style.foottab" @focusout="onFocusout"
      @focusin="layout.footTabSize.active = true" tabindex="-1">
      <nav class="scrollx" :class="$theme['foottab-nav']" v-scrollx>
         <ul :class="$theme['foottab-nav-label']">
            <b></b>
            <div v-for="tab in <FootTab[]>foottab.footTabList" @click="onTabClick(tab)" draggable="true" :key="tab.id"
               @drop="onTabDrop($event, tab)" @dragstart="onTabDragStart($event, tab)" @dragover.prevent
               :style="{ order: tab.order }">
               <li :selected="foottab.selected.id === tab.id">
                  <span v-svgicon="tab.label" padding="13%"></span>
                  <b>{{ tab.name }}</b>
                  <em style="visibility: hidden;">{{ tab.badge }}</em>
               </li>
               <s v-if="tab.badge">{{ tab.badge }}</s>
            </div>
            <i></i>
            <!-- 脚部tab工具按钮 -->
            <p v-svgicon="arrowUp" @click="onUpClick"></p>
            <p v-svgicon="arrowDown" @click="onDownClick"></p>
            <q v-svgicon="minSvg" padding="15%" :selected="layout.footTabSize.canHidden"
               @click="layout.footTabSize.canHidden = !layout.footTabSize.canHidden"></q>
            <q v-svgicon="fix" :selected="isFixSelected" @click="isFixSelected = !isFixSelected"></q>
            <span id="foottab-tools" :class="$style['foottab-tools']"></span>
         </ul>
      </nav>
      <main>
         <KeepAlive>
            <component :is="foottab.selected.type" :key="foottab.selected.type"></component>
         </KeepAlive>
      </main>
   </div>
</template>

<style scoped src="@css/foottab.scss" module="$theme" />
<style scoped lang="scss" module>
$height: layout-size(foottab);

.foottab {
   height: 100%;
   line-height: line-height(small);

   >nav {
      height: $height;

      >ul {
         display: flex;
         flex-wrap: nowrap;
         z-index: auto;
         height: 100%;
         overflow: visible;

         >b {
            width: align-size(tiny);
         }

         >div {
            position: relative;
            flex: 0 0 auto;
            margin: 0 align-size(tiny);

            s {
               position: absolute;
               display: block;
               top: align-size(tiny);
               right: align-size(small);
               height: align-size(large);
               line-height: align-size(large);
               aspect-ratio: 1;
               text-align: center;
            }
         }

         li {
            display: flex;
            align-items: center;
            height: 100%;

            padding: 0 align-size(normal);
            overflow: hidden;

            >span {
               height: 100%;
               aspect-ratio: 1;
               overflow: hidden;
            }
         }

         >i {
            order: 5;
            display: block;
            width: 2em;
            height: 100%;
         }

         >p,
         >q {
            /* flex: 1 0 0; */
            height: 100%;
            aspect-ratio: 1;
            margin: 0 align-size(tiny);
            order: 10;
         }
      }
   }

   >main {
      height: calc(100% - $height);
      min-width: 0;
   }
}

.foottab-tools {
   display: flex;
   height: 100%;
   width: fit-content;
   order: 15;
}
</style>
