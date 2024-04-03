import { shallowReactive } from 'vue';
import { exec, useLogger } from '@/boot/apis';
import { fromRaw, MarkdownDto, MarkdownRo, MarkdownVo, useToRaw } from '@ra2inier/core';


const log = useLogger('markdown-store')
const markdowns: Record<string, MarkdownRo> = shallowReactive({})


async function openMarkdownByKey(key: string) {
   const { status, data } = await exec<MarkdownVo>('markdown/get/' + key)
   if (status) {
      const tmp = fromRaw(data, MarkdownRo)
      return markdowns[tmp.key] = tmp
   } else {
      log.info('加载markdown文件失败：' + key, data)
      return undefined
   }
}

export async function useMarkdown(key: string) {
   if (markdowns[key]) return markdowns[key]
   return await openMarkdownByKey(key)
}

const toRaw = useToRaw(new MarkdownDto, true)
export function saveMarkdown(markdown: MarkdownRo) {
   exec('markdown/save', { data: toRaw(markdown) }).then((res) => {
      if (res.status) {
         log.info('保存markdown文件成功', markdown.fullname)
      } else {
         log.warn('保存markdown文件失败', res.data)
      }
   })
}

export function addMarkdown() {
   const newOne = new MarkdownRo
   return markdowns[newOne.key] = newOne
}
