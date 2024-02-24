import {
  dictionary, IniObjectRo, mappers, mergeProjectVo, objects,
  ProjectVo, WordValidity,
} from '@ra2inier/core';

import { log, on } from '../boot';
import { checkWordHook, createCtx, mapperCtxs, matchMapper } from './build';
import { doTranslateObject } from './object';

// 项目初始化
on('project/init', (project: ProjectVo) => {
   mergeProjectVo(project)
   return true
})

// 单词条校验逻辑
on('word/validate', (info: { wordKey: string, values: string[] }) => {
   const { wordKey, values } = info
   // 在本地字典中寻找目标的word
   const word = dictionary[wordKey], validity = new WordValidity
   checkWordHook(word)
   if (word.hooks.validate) {
      try { return word.hooks.validate(values, createCtx()) ?? validity }
      catch (e) { log.error(`执行${word.fullname}的"validate hook"时出错:${e}`) }
   }
   return validity
})

// 项目构建入口
on('project/build', (buildList: string[]) => {
   const results: Record<string, string[][]> = {}
   const objectsList: IniObjectRo[] = []
   for (const key of buildList) {
      const object = objects[key]
      const translation = doTranslateObject(object)
      if (translation) {
         objectsList.push(object)
         results[key] = translation
      }
   }
   console.log(results)

   // 分发到mapper中
   for (const object of objectsList) {
      const calls = matchMapper(object.scope, mappers)
      if (!calls) {
         log.warn(object.name + '没有输出器')
         continue
      }
      for (const call of calls) {
         call(results[object.key])
      }
   }

   console.log(mapperCtxs)
})
