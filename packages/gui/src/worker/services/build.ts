import {
  createMapperHandlers, createWordHooks, Entry, forIn, HookCtx,
  MapperRo, StartHandler, WordRo,
} from '@ra2inier/core';

import { log } from '../apis';
import { dictionary } from '../boot';

/**
 * 创建一个hook执行的上下文对象HookCtx
 */
export function createCtx(): HookCtx {
   return {
      log: log.info
   }
}

/**
 * 创建一个翻译对象的上下文词典
 * @returns words: <word name : word 本身>
 */
export const Map4WordName2Word: Record<string, WordRo> = {}
export function createTranslateReferWords(entrys: Entry[]) {
   const entryNameSet = new Set<string>(entrys.map(e => e.key))
   const ret: Record<string, WordRo> = {}
   forIn(dictionary, (key, val) => {
      if (entryNameSet.has(val.name)) {
         Map4WordName2Word[val.name] = val
         ret[val.name] = val
      }
   })
   return ret
}

/**
 * 通过给定的word name值查找相应的
 */
export function findWordByName(wordName: string) {
   forIn(dictionary, (key, val) => {
      // if ()
   })
}

/**
 * 检查一个word的hooks是否存在，如果不存在就为其创建
 */
export function checkWordHook(word: WordRo) {
   if (!word.hooks) {
      try { word.hooks = createWordHooks(word) }
      catch (e) { log.error(`加载${word.fullname}的hooks时出错:${e}`) }
   }
}

/**
 * 检查一个mapper的handler是否已经解析，如果不存在则为其创建
 */
export function checkMapperHandlers(mapper: MapperRo) {
   if (mapper.handlers) return
   try { mapper.handlers = createMapperHandlers(mapper) }
   catch (e) { log.error(`加载${mapper.fullname}的handlers时出错:${e}`) }
}

export class MapperCtx {
   data = {}
   mapper: MapperRo
   constructor(mapper: MapperRo) {
      this.mapper = mapper
      const start = <StartHandler>mapper.handlers['start']
      if (start) start(this.data, {})
   }
}

export type MapperHandlerCall = (object: string[][]) => void
export const map4scopeName2mapper: Record<string, MapperHandlerCall[]> = {}
export const mapperCtxs: Record<string, MapperCtx> = {}
/**
 * 传入一个scope的名字，和所有mappers表，返回接受该scope类型的所有handler的调用函数
 */
export function matchMapper(scopeName: string, mappers: Record<string, MapperRo>) {
   if (scopeName in map4scopeName2mapper) return map4scopeName2mapper[scopeName]
   map4scopeName2mapper[scopeName] = []
   forIn(mappers, (mapperKey, mapper) => {
      checkMapperHandlers(mapper)
      if (!mapperCtxs[mapperKey])
         mapperCtxs[mapperKey] = new MapperCtx(mapper)
      const mapperCtx = mapperCtxs[mapperKey]
      forIn(mapper.inputList, (scopeRules, handlerName) => {
         // 更多匹配规则
         const ret = scopeName.match(scopeRules)
         if (ret) map4scopeName2mapper[scopeName].push((object) => {
            mapper.handlers[handlerName](object, mapperCtx.data, {})
         })
      })
   })
   return map4scopeName2mapper[scopeName]
}
