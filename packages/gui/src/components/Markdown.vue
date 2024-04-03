<script lang='ts' setup>
import { onBeforeUnmount, ref, shallowReactive, watch } from 'vue';
import { Marked } from 'marked'
import addImgSvg from '@/asset/icons/addImage.svg?raw';
import closeSvg from '@/asset/icons/close.svg?raw';
import { copy, forIn, MarkdownRo } from '@ra2inier/core';
import { FlexArea, LazyButton } from '@ra2inier/wc';

interface Prop {
   markdown: MarkdownRo,
   disabled: Boolean,
}
const props = defineProps<Prop>()

const marked = new Marked({
   breaks: true,
   gfm: true,
   renderer: {
      image(href, title, text) {
         return `<img src="${props.markdown?.urls?.[href] || href}" alt="${text || '#'}" title="${text}(${href})" />`
      },
   }
})

function parseMd(markdown: MarkdownRo) {
   return marked.parse(markdown.raw)
}

const data = shallowReactive(props.markdown)
watch(() => props.markdown, async () => {
   copy(props.markdown, data)
   forIn(data.images, (name, buf) => {
      data.urls[name] = URL.createObjectURL(new Blob([buf], { type: 'image' }))
   })
   data.md = await parseMd(data)
}, { immediate: true })


defineExpose({ get value() { return data } })

// 在组件销毁时释放图片资源
onBeforeUnmount(() => {
   forIn(data.urls, (Key, url) => {
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
   if (!files) return
   let file: File, id = 0
   const urls = { ...data.urls }
   const images = { ...data.images }
   while (file = files[id++]) {
      if (!(file.name in data.images)) {
         images[file.name] = new Uint8Array(await file.arrayBuffer())
         urls[file.name] = URL.createObjectURL(file)
      }
   }
   data.urls = urls
   data.images = images
}

function onDeleteClick(name: string) {
   delete data.images[name]
   URL.revokeObjectURL(data.urls[name])
   delete data.urls[name]
}

function onImageClick(name: string) {
   navigator.clipboard.writeText(name)
}

// 渲染的缓存机制
let prev: string
watch(() => props.disabled, async () => {
   if (props.disabled && !(prev == data.raw)) {
      prev = data.raw
      data.md = await parseMd(data)
   }
})

</script>


<template>
   <div :class="$style.editor">
      <!-- markdown渲染器 -->
      <template v-if="disabled">
         <div class="markdown" v-html="data.md || 'NO MARKDOWN'" mdarea></div>
      </template>
      <!-- 图片选择 -->
      <template v-else>
         <nav :class="$style['file-box']" @click="onAddImageClick">
            <lazy-button class="fore-button" title="从本地中添加图片">
               <div v-svgicon="addImgSvg" padding="15%"></div>
            </lazy-button>
            <input tabindex="-1" ref="fileInput" @change="onFileChange" accept="image/*" multiple type="file">
         </nav>
         <ul v-scrolls class="scrollxb">
            <li v-for="(url, name) in data.urls" :key="name">
               <h3 :title="name"><i>{{ name }}</i></h3>
               <h4></h4>
               <div><img @click="onImageClick(name)" :src="url" :title="'单击复制文件名：' + name" alt="#"></div>
               <b v-svgicon="closeSvg" class="fore-button" @click="onDeleteClick(name)"></b>
            </li>
         </ul>
         <h2>
            <flex-area class="normal-rpanel" v-model.lazy="data.raw" placeholder="添加markdown文本"></flex-area>
         </h2>
      </template>
   </div>
</template>

<style lang='scss'>
div.markdown[mdarea] {
   font-size: var(--font-size-normal);
   width: 100%;
   @import "@/css/app/markdown.scss";
}
</style>

<style lang="scss" scoped module>
$height: line-height(normal);

.file-box {
   display: flex;
   align-items: center;
   line-height: $height;
   cursor: default;

   span {
      height: 100%;
      padding: 0 align-size(small);
   }

   input {
      height: 0px;
      width: 0px;
   }
}

.editor {
   display: block;
   width: 100%;

   h2 {
      margin-top: align-size(large);
   }

   ul {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
   }

   li {
      position: relative;
      overflow: hidden;
      min-width: fit-content;

      h3 {
         position: absolute;
      }

      h4 {
         width: 1em;
         height: 1em;
      }

      b {
         position: absolute;
         right: 0;
         top: 0;
         z-index: 2;
         height: 0.7 * $height;
         width: 0.7 * $height;
      }
   }

   lazy-button {
      height: $height;

      div {
         height: $height;
         aspect-ratio: 1;
      }
   }

   img {
      display: block;
      height: 20em;
      max-height: 200px;
   }

   flex-area {
      width: 100%;
      padding: 0 align-size(small);
   }
}
</style>
