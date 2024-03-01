import {
  createMapperHandlers, createWordHooks, Entry, FinalHandler, FinalOutput,
  forIn, HookCtx, IniObjectRo, MapperRo, OutputHandler,
  StartHandler, WordRo,
} from '@ra2inier/core';

import { log } from '../apis';
import { dictionary, mappers } from '../boot';
import { doTranslateObject } from './object';

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
   if (!mapper.data) mapper.data = {}
   if (mapper.handlers) return
   try { mapper.handlers = createMapperHandlers(mapper) }
   catch (e) { log.error(`加载${mapper.fullname}的handlers时出错:${e}`) }
}


export interface MapperHandlerCall {
   (object: string[][]): void
   mapper: MapperRo
   handlerName: string
}
export const map4scopeName2mapper: Record<string, MapperHandlerCall[]> = {}
/**
 * 传入一个scope的名字，和所有mappers表，返回接受该scope类型的所有handler的调用函数
 */
export function matchMapper(scopeName: string, mappers: Record<string, MapperRo>) {
   if (scopeName in map4scopeName2mapper) return map4scopeName2mapper[scopeName]
   map4scopeName2mapper[scopeName] = []
   forIn(mappers, (mapperKey, mapper) => {
      checkMapperHandlers(mapper)
      forIn(mapper.inputList, (scopeRules, handlerName) => {
         // 更多匹配规则
         const ret = scopeName.match(scopeRules)
         if (!ret) return
         const c: MapperHandlerCall = (object) => {
            mapper.handlers?.[handlerName](object, mapper.data, {})
         }
         c.mapper = mapper
         c.handlerName = handlerName
         map4scopeName2mapper[scopeName].push(c)
      })
   })
   return map4scopeName2mapper[scopeName]
}

/**
 * 构建流程
 */
export function doBuild(objectsList: IniObjectRo[]) {

   // 1.执行对象翻译步骤
   const translationResults: Record<string, string[][]> = {}
   for (const object of objectsList) {
      const translation = doTranslateObject(object)
      if (translation) translationResults[object.key] = translation
   }

   // 2.将ini对象翻译结果分发到mapper中
   const mapperToOutput = new Set<MapperRo>()
   for (const object of objectsList) {
      const calls = matchMapper(object.scope, mappers)
      if (!calls) {
         log.warn(object.name + '没有输出器')
         continue
      }
      for (const call of calls) {
         try {
            call(translationResults[object.key])
            mapperToOutput.add(call.mapper)
         } catch (e) {
            console.log('输出器执行错误，请检查输出器代码')

            console.log(call.handlerName)
         }
      }
   }

   // 3.调用输入器的output handler
   const outputDatas = doMapperHandle(mapperToOutput)

   return outputDatas
}

/**
 * 调用handler
 */
function doMapperHandle(mapperToOutput: Set<MapperRo>) {
   const outputDatas: Record<string, string> = {}
   const outputCtx = createOutputCtx()
   for (const mapper of mapperToOutput) {
      // start handler
      const start = <StartHandler>mapper.handlers['start']
      if (start) start(mapper.data, outputCtx)

      // input handler
      const handlers = mapper.handlers
      for (const ohn of mapper.outputList) {
         const oh = <OutputHandler>handlers[ohn]
         oh(mapper.data, outputCtx)
      }

      // final handler
      const final = <FinalHandler>handlers.final
      if (!final) {
         log.warn('输出器缺失final output handler：' + mapper.name)
         continue
      }
      const ret = final(mapper.data, outputCtx)

      // 4. 结算输出结果
      outputDatas[mapper.targetPath] = mergeIniResult(ret)
   }
   return outputDatas
}

/**
 * 构建输出器环境变量MapperCtx
 */
function createOutputCtx() {


   return {}
}

/**
 * 归并最终的输出结果
 */
function mergeIniResult(ret: FinalOutput) {
   let data: string = ''
   if (typeof ret === 'string') data = ret
   else if (ret instanceof Array) {
      const tmp: string[] = []
      for (const line of ret) {
         if (typeof line === 'string') tmp.push(`[${line}]`)
         else tmp.push(`${line[0]}=${line[1]}`)
      }
      data = tmp.join('\n')
   } else {
      const tmp: string[] = []
      for (const sectionName in ret) {
         tmp.push(`[${sectionName}]`)
         const section = ret[sectionName]
         for (const key in section) {
            tmp.push(`${key}=${section[key]}`)
         }
      }
      data = tmp.join('\n')
   }
   return data
}
