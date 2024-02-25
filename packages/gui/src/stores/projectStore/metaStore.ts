import { exec, work } from '@/boot/apis';
import {
  dictionary, MapperRo, mappers, MarkdownRo, project,
  ScopeRo, WordRo, WordValidity,
} from '@ra2inier/core';

import useLog from '../messageStore';

const log = useLog('meta-store')

export function saveScope(scope: ScopeRo) {
   exec('project/save-scope', { data: scope }).then((res) => {
      if (res.status) {
         log.info('保存"对象类型"成功', scope.fullname)
      } else {
         log.warn('保存"对象类型"失败', res.data)
      }
   })
}

const mainDictionary = () => project.main!.dictionary

export function addWord() {
   const word = new WordRo
   const md = new MarkdownRo
   word.detail = md.key
   word.markdown = md
   mainDictionary()[word.key] = dictionary[word.key] = word
   return word
}

export function saveWord(word: WordRo) {
   dictionary[word.key] = word
   mainDictionary()[word.key] = dictionary[word.key] = word
   exec('project/save-word', { data: word }).then((res) => {
      if (res.status) {
         log.info('保存"词条"成功', word.fullname)
      } else {
         log.warn('保存"词条"失败', res.data)
      }
   })
}

export function getWord(key: string): WordRo | undefined {
   return dictionary[key]
}

export async function queryWordByName(name: string): Promise<WordRo> {
   return new Promise((solve, reject) => {
      for (const key in dictionary) {
         if (dictionary[key].name === name)
            return dictionary[key]
      }
      reject(undefined)
   })
}

export function queryWordByNameSync(name: string) {
   if (!name) return undefined
   for (const key in dictionary) {
      if (dictionary[key].name === name)
         return dictionary[key]
   }
   return undefined
}



export function saveMapper(mapper: MapperRo) {
   mapper.update()
   mappers[mapper.key] = mapper
   exec('project/save-mapper', { data: mapper }).then(res => {
      if (res.status) {
         log.info('保存"输入器"成功', mapper.fullname)
      } else {
         log.warn('保存"输出器"失败', res.data)
      }
   })
   work('mapper/sync', mapper)
}


const wordValidateCache: Record<string, WordValidity> = {}
/**
 * 校验词条
 */
export async function validateWord(wordKey: string, values: string[]) {
   if (wordValidateCache[wordKey]) return wordValidateCache[wordKey]
   const word = dictionary[wordKey]
   if (!word) return _setCache(wordKey, new WordValidity)
   const res = await work('word/validate', { wordKey: wordKey, values })
   if (res.status) {
      return _setCache(wordKey, <any>res.data)
   } else {
      log.warn('词条校验失败：' + word.fullname)
      return _setCache(wordKey, new WordValidity)
   }
}
function _setCache(key: string, v: WordValidity) {
   wordValidateCache[key] = v
   setTimeout(() => {
      delete wordValidateCache[key]
   }, 3600)
   return v
}

/**
 * 翻译词条
 */
export async function translateWord(wordKey: string) {
   const { status, data } = await work('translate-word', { wordKey })
   return status
}
