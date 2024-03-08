import { exec, work } from '@/boot/apis';
import {
  MapperRo, MarkdownRo, ScopeRo, WordRo, WordValidity,
} from '@ra2inier/core';

import useLog from '../messageStore';
import { all, mainKey, setValue } from './boot';

const log = useLog('meta-store')

/**
 * scope 逻辑
 * **********************************************************************************************************************
 */

/**
 * 保存scope到硬盘
 */
export function saveScope(scope: ScopeRo) {
   setValue('scopes', scope.key, scope)
   exec('project/save-scope', { data: scope }).then((res) => {
      if (res.status) {
         log.info('保存"对象类型"成功', scope.fullname)
      } else {
         log.warn('保存"对象类型"失败', res.data)
      }
   })
}

/**
 * 添加一个scope
 */
export function addScope(name = Math.random() + '') {
   const scope = new ScopeRo
   scope.name = name
   scope.package = mainKey()
   setValue('scopes', scope.key, scope)
   return scope
}


/**
 * word 逻辑
 * **********************************************************************************************************************
 */

/**
 * 添加一个词条
 */
export function addWord(name = Math.random() + '') {
   const word = new WordRo
   const md = new MarkdownRo
   word.detail = md.key
   word.markdown = md
   word.name = name
   word.package = mainKey()
   setValue('dictionary', word.key, word)
   return word
}

/**
 * 保存词条到硬盘
 */
export function saveWord(word: WordRo) {
   setValue('dictionary', word.key, word)
   exec('project/save-word', { data: word }).then((res) => {
      if (res.status) {
         log.info('保存"词条"成功', word.fullname)
      } else {
         log.warn('保存"词条"失败', res.data)
      }
   })
}

export async function queryWordByName(name: string): Promise<WordRo> {
   const dictionary = all.dictionary
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
   const dictionary = all.dictionary
   for (const key in dictionary) {
      if (dictionary[key].name === name)
         return dictionary[key]
   }
   return undefined
}

/**
 * 从整个项目中获得word，根据key值
 */
export function queryWordByKey(key: string) {
   return all.dictionary[key]
}

/**
 * 校验词条
 */
const wordValidateCache: Record<string, WordValidity> = {}
export async function validateWord(wordKey: string, values: string[]) {
   if (wordValidateCache[wordKey]) return wordValidateCache[wordKey]
   const word = all.dictionary[wordKey]
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


/**
 * mapper 逻辑
 * **********************************************************************************************************************
 */

/**
 * 保存mapper到硬盘
 */
export function saveMapper(mapper: MapperRo) {
   setValue('mappers', mapper.key, mapper)
   exec('project/save-mapper', { data: mapper }).then(res => {
      if (res.status) {
         log.info('保存"输入器"成功', mapper.fullname)
      } else {
         log.warn('保存"输出器"失败', res.data)
      }
   })
   work('mapper/sync', mapper)
}

/**
 * 添加一个mapper
 */
export function addMapper(name = 'NEW_MAPPER') {
   const mapper = new MapperRo
   mapper.name = name
   mapper.package = mainKey()
   setValue('mappers', mapper.key, mapper)
   return mapper
}
