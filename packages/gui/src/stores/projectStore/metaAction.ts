import { exec, useLogger, work } from '@/boot/apis';
import { MapperRo, MarkdownRo, ScopeRo, WordRo, WordValidity, useMemo } from '@ra2inier/core';

import { ProjectBoot, createEmpty } from './boot';

export function createMetaAction(boot: ProjectBoot) {
   const logger = useLogger('meta-action')
   const { setValue, mainKey, main } = boot

   function addScope(name = Math.random() + '') {
      const scope = new ScopeRo
      scope.name = name
      scope.package = mainKey.value
      setValue('scopes', scope.key, scope)
      return scope
   }

   async function saveScope(scope: ScopeRo) {
      const { status, data } = await exec('project/save-scope', { data: scope })
      if (!status) return logger.warn('保存"对象类型"失败', data)
      setValue('scopes', scope.key, scope)
      logger.info('保存"对象类型"成功', scope.fullname)
   }

   function addWord(name = Math.random() + '') {
      const word = new WordRo
      const md = new MarkdownRo
      word.detail = md.key
      word.markdown = md
      word.name = name
      word.package = mainKey.value
      setValue('dictionary', word.key, word)
      return word
   }

   async function saveWord(word: WordRo) {
      const { status, data } = await exec('project/save-word', { data: word })
      if (!status) return logger.warn('保存"词条"失败', data)
      setValue('dictionary', word.key, word)
      logger.info('保存"词条"成功', word.fullname)
   }

   const NONE_VALIDITY = new WordValidity
   const [validateWord, setCache] = useMemo(_validateWord, x => x, 3500)
   async function _validateWord(wordKey: string, values: string[]): Promise<WordValidity> {
      const word = main.value.dictionary[wordKey]
      if (!word) return setCache(wordKey, NONE_VALIDITY)
      const { status, data } = await work<WordValidity>('word/validate', { wordKey, values })
      if (status) return data
      else return setCache(wordKey, NONE_VALIDITY)
   }

   async function translateWord(wordKey: string) {
      const { status, data } = await work('translate-word', { wordKey })
      return status
   }

   function addMapper(name = 'NEW_MAPPER') {
      const mapper = new MapperRo
      mapper.name = name
      mapper.package = mainKey.value
      setValue('mappers', mapper.key, mapper)
      return mapper
   }

   async function saveMapper(mapper: MapperRo) {
      setValue('mappers', mapper.key, mapper)
      const { status, data } = await exec('project/save-mapper', { data: mapper })
      if (!status) return logger.warn('保存"输出器"失败', data)
      logger.info('保存"输入器"成功', mapper.fullname)
      // TODO:
      const { } = await work('mapper/sync', mapper)
   }

   return {
      addMapper,
      addScope,
      addWord,
      saveMapper,
      saveScope,
      saveWord,
      translateWord,
      validateWord
   }
}


export const EMPTY_MEAT_ACTION = createEmpty(createMetaAction)
