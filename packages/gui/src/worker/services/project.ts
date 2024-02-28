import {
  FinalHandler, forIn, IniObjectRo, MapperRo, mergeMappers,
  mergeObjects, mergeScopes, mergeWords, OutputHandler, ProjectVo,
  WordValidity,
} from '@ra2inier/core';

import { exec, log, on } from '../apis';
import { dictionary, mappers, objects, scopes, setMapper } from '../boot';
import { checkWordHook, createCtx, mapperCtxs, matchMapper } from './build';
import { doTranslateObject } from './object';

// 项目初始化
on('project/init', (project: ProjectVo) => {
   forIn(project.packages, (pkgKey, packageVo) => {
      mergeObjects(packageVo.objects, pkgKey, objects)
      mergeScopes(packageVo.scopes, pkgKey, scopes)
      mergeWords(packageVo.dictionary, pkgKey, dictionary)
      mergeMappers(packageVo.mappers, pkgKey, mappers)
   })
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

   // 将ini对象分发到mapper中
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


   // 调用输入器的output handler
   forIn(mapperCtxs, (key, mapperCtx) => {
      const handlers = mapperCtx.mapper.handlers
      for (const ohn of mapperCtx.mapper.outputList) {
         const oh = <OutputHandler>handlers[ohn]
         oh(mapperCtx.data, {})
      }
      const final = <FinalHandler>handlers.final
      if (!final)
         return log.warn('输出器缺失final output handler：' + mapperCtx.mapper.name)
      const ret = final(mapperCtx.data, {})

      // 更多的处理操作
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

      exec('project/output', {
         outputPath: mapperCtx.mapper.targetPath,
         data
      })
   })
})


on('mapper/sync', (mapper: MapperRo) => {
   // mappers[mapper.key] = mapper
   setMapper(mapper.key, mapper)
})
