import {
  forIn, IniObjectRo, MapperRo, mergeMappers, mergeObjects,
  mergeScopes, mergeWords, ProjectVo, WordValidity,
} from '@ra2inier/core';

import { exec, log, on } from '../apis';
import {
  clearAll, dictionary, mappers, objects, scopes,
  setMapper,
} from '../boot';
import { checkWordHook, createCtx, doBuild } from './build';

// 项目初始化
on('project/init', (project: ProjectVo) => {
   clearAll()
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
   const objectsList: IniObjectRo[] = []
   for (const key of buildList) {
      const object = objects[key]
      if (object) objectsList.push(object)
   }

   const outputs = doBuild(objectsList)

   forIn(outputs, (path, data) => {
      exec('project/output', {
         outputPath: path,
         data
      })
   })
})


on('mapper/sync', (mapper: MapperRo) => {
   // mappers[mapper.key] = mapper
   setMapper(mapper.key, mapper)
})
