<script lang='ts' setup>
import { onBeforeUnmount, ref, watch } from 'vue';

import markDownIt from 'markdown-it';

import { forIn, MarkdownRo } from '@ra2inier/core';

import TextBox from './TextBox.vue';

defineOptions({ name: 'Markdown' })
const maskdownit = new markDownIt({
   breaks: true,
   linkify: true
})

const props = defineProps({
   data: { type: MarkdownRo, required: true },
   disabled: { type: Boolean, default: true }
})

// 渲染逻辑
const imgLinkLike = /(?<=!\[.*\]\()((?!http).+)(?=\))/g
const substr = (sub: string) => {
   const data = props.data
   for (const name in data.urls) {
      if (sub.trim() === name)
         return data.urls[name]
   }
   return sub
}

function parseMd(markdoen: MarkdownRo) {
   const hot = markdoen.raw.replaceAll(imgLinkLike, substr)
   return maskdownit.render(hot)
}

watch(() => props.data, () => {
   const data = props.data
   if (!data) return
   forIn(data.images, (key, buf) => {
      data.urls[key] = URL.createObjectURL(new Blob([buf], { type: 'image' }))
   })
   data.md = parseMd(data)
}, { immediate: true })

// 在组件销毁时释放图片资源
onBeforeUnmount(() => {
   forIn(props.data.urls, (Key, url) => {
      URL.revokeObjectURL(url)
   })
})


// 图片框的逻辑
const fileInput = ref<HTMLInputElement>()
function onAddImageClick() {
   fileInput.value?.click()
}

async function onFileChange(e: Event) {
   const { files } = e.target as HTMLInputElement
   const data = props.data
   if (!files) return
   let file: File, id = 0
   while (file = files[id++]) {
      if (!(file.name in data.images)) {
         data.images[file.name] = new Uint8Array(await file.arrayBuffer())
         data.urls[file.name] = URL.createObjectURL(file)
      }
   }
}

function onDeleteClick(name: string) {
   const data = props.data
   delete data.images[name]
   URL.revokeObjectURL(data.urls[name])
   delete data.urls[name]
}

function onImageClick(name: string) {
   navigator.clipboard.writeText(name)
}


// 渲染的缓存机制
let prev: string
watch(() => props.disabled, () => {
   const data = props.data
   if (props.disabled && !(prev == data.raw)) {
      prev = data.raw
      data.md = parseMd(data)
   }
})

</script>


<template>
   <div class="local-text-editor">
      <!-- markdown渲染器 -->
      <div v-show="disabled">
         <div class="markdown" v-html="data.md ? data.md : 'NO MARKDOWN'" mdarea></div>
      </div>
      <!-- 图片选择 -->
      <section v-show="!disabled">
         <h2 class="file-box c-bg-l rd" @click="onAddImageClick">
            <span>添加本地图片</span><input tabindex="-1" ref="fileInput" @change="onFileChange" accept="image/*" multiple
               type="file">
         </h2>

         <ul v-scrolls class="scrollxb">
            <li v-for="(url, name) in data.urls" :key="name">
               <h3 class="list-item" :title="name">
                  <i>{{ name }}</i>
               </h3>
               <div><img @click="onImageClick(name)" :src="url" title="单击复制文件名" alt="#"></div>
               <b v-svgicon="'icons/close.svg'" @click="onDeleteClick(name)" class="c-bg-l c-t-l c-h-l rd"></b>
            </li>
         </ul>
      </section>
      <TextBox v-model:text="data.raw" v-show="!disabled" :disabled="disabled" />
   </div>
</template>

<style lang='scss'>
div.markdown[mdarea] {
   font-size: var(--font-size-normal);
   width: 100%;
   @import "@/css/app/markdown.scss";
}
</style>

<style lang="scss" scoped>
$head-height: 30px;
$line-height: 30px;

.local-text-editor {
   padding: 1em;

   ul {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;

      li {
         position: relative;
         overflow: hidden;
         min-width: fit-content;

         h3 {
            position: absolute;
            top: 0;
            left: 0;
            padding-left: 0px;
            margin-right: $line-height;
         }

         b {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 2;
            height: 0.7* $line-height;
            width: 0.7* $line-height;
            padding: $line-height*0.1;
         }
      }

      img {
         display: block;
         margin-top: 1.5em;
         height: 20em;
         max-height: 200px;
      }
   }

   .file-box {
      display: inline-block;
      line-height: $line-height;
      padding: 0 16px;
      cursor: default;

      input {
         height: 0px;
         width: 0px;
      }
   }
}
</style>
