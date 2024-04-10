<script lang='ts' setup>
import Options from '@/components/Options.vue';
import { useConfigStore } from '@/stores/config';
import { FlexArea, FlexInput } from '@ra2inier/wc';
import { computed, reactive, ref } from 'vue';
import { useThemeState } from '@/states/theme'
import { useFolder } from '@/hooks/folder';
import ListView from '@/components/ListView.vue';
import { IItem } from '@/components/ListViewState';
import addSvg from '@/asset/icons/add.svg?raw'

defineOptions({ name: 'Setting' })
const { config, set } = useConfigStore()
const proxy = new Proxy(config, {
   get(target, p: string) { return target[p] },
   set(target, p: string, newValue) {
      set(p, newValue)
      return true
   },
})

// 主题控制逻辑
const theme = useThemeState()
const themeList = computed(() => Object.keys(theme.map))
const _f = (x: any) => <Partial<IItem>>reactive({ value: x })
const themeList2 = computed(() => {
   const tmp = Object.keys(theme.map).map(_f)
   const target = tmp.find(x => x.value === theme.name)
   if (target) target.selected = true
   else if (tmp[0]) tmp[0].selected = true
   return tmp
})

const cursorName = ref(theme.name)
function onThemeSelect(item: IItem, order: number) {
   cursorName.value = item.value
}

function onTextChange(e: CustomEvent) {
   theme.setTheme(cursorName.value, e?.detail || '')
}

const theNew = ref('')
function onAddThemeClick() {
   const nv = theNew.value
   if(!nv) return
   theme.addTheme(nv)
   theme.name = nv
   cursorName.value = nv
   theNew.value = ''
}

function onThemeDelete(item: IItem, order: number) {
   theme.setTheme(item.value, undefined)
}

const { folded, vFolder } = useFolder(undefined, true)
</script>


<template>
   <div :class="$style.setting" class="scroll">
      <li>
         <span>GPU加速：</span>
         <Options :alias="['开启', '关闭']" :values="['yes', 'no']" v-model="proxy.GPU"></Options>
      </li>
      <li>
         <s v-folder>&gt;</s>
         <span @click="folded = !folded">主题：</span>
         <Options :values="themeList" v-model="theme.name"></Options>
      </li>
      <p v-show="!folded" :class="$style.list">
         <ListView :list="themeList2" @select="onThemeSelect" @delete="onThemeDelete" :single-select="true">
            <template #footer>
               <flex-input v-model="theNew" class="normal-input" placeholder="添加新主题" @keydown.enter="onAddThemeClick">
               </flex-input>
               <em v-svgicon="addSvg" class="normal-button" @click="onAddThemeClick"></em>
            </template>
         </ListView>
      </p>
      <p v-if="!folded">
         <flex-area :text="theme.map[cursorName]" @change="onTextChange" class="normal-rpanel"></flex-area>
      </p>
      <footer></footer>
   </div>
</template>

<style scoped lang='scss' module>
$align: align-size(normal);

.setting {
   padding: $align 0;

   >* {
      margin: align-size(tiny) 0;
   }

   li {
      display: flex;
      padding: 0 $align;
      height: 1lh;
   }

   p {
      padding: 0 $align ;
   }

   footer {
      height: max(40%, 400px);
   }

   flex-area {
      display: block;
      width: 100%;
      padding: 0 1ch;
   }

   em {
      display: inline-block;
      height: 0.7lh;
      aspect-ratio: 1;
      margin-left: $align;
   }

   .list {
      width: 400px;
      min-width: fit-content;
      max-width: 80%;
   }
}
</style>
