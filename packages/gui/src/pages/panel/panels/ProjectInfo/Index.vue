<script lang='ts' setup>
import { reactive, ref, watch } from 'vue';
import saveSvg from '@/asset/icons/save.svg?raw';
import MapBox from '@/components/dirty/MapBox.vue';
import { LazyButton, FlexInput } from '@ra2inier/wc';
import HeaderLayout from '../HeaderLayout.vue'
import { createProjectInfo } from './state';
import { useDisabled } from '@/hooks/disabledFn'
import { useProjectStore } from '@/stores/projectStore';
import ReferView from '../ReferView.vue';
import { useReferViewState } from '../ReferViewState';

defineOptions({ name: 'ProjectInfo' })
const store = useProjectStore()
const info = reactive(createProjectInfo(store.project))
const init = () => Object.assign(info, createProjectInfo(store.project))
watch(() => store.project, init)
const referList = ref<InstanceType<typeof ReferView>>()

const [onFlushClick] = useDisabled(async () => {
   // 获取需要添加的包
   const map = referList.value!.value
   await store.updatePackage(map)
   // for (const r of info.references) {
   //    r.detail = (r.key in store.packages) ? DetailType.loaded : DetailType.unloaded
   // }
})

const state = useReferViewState(info.references)
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
         <li class="line"><span>项目作者：</span><flex-input class="normal-input" v-model.lazy="info.author" /></li>
         <li class="line"><span>目标环境：</span><flex-input class="normal-input" v-model.lazy="info.target" /></li>
         <ReferView ref="referList" :state="state"></ReferView>
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

      >* {
         vertical-align: top;
      }
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
   }

   lazy-button {
      flex: 0 0 auto;
      height: 1lh;
      aspect-ratio: 1;
   }


   flex-input {
      display: inline-block;
      height: 1lh;
      min-width: 4em;
   }
}
</style>
