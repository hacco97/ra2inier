import path from 'node:path';

import { component, inject } from '~/mainWindow/ioc.config';

import { fromRaw, isUniqueObject, Word } from '@ra2inier/core';
import {
   escapePath, readFile, readJson, writeFile, writeJson,
} from '@ra2inier/core/node';

import { DaoConfig } from './DaoConfig';

// word被抽象成一个文件夹，里面包含众多文件

@component('word-dao')
export class WordDao {
   @inject('dao-config') declare daoConfig: DaoConfig

   readWordByPath(wordDir: string) {
      const word: Word = readJson(escapePath(wordDir, this.daoConfig.WORD_INFO_FILE))
      if (!isUniqueObject(word)) return undefined
      word.hookScript = readFile(escapePath(wordDir, this.daoConfig.WORD_HOOK_FILE))
      word.dictionary = path.dirname(wordDir).split('/').pop()!
      return fromRaw(word, Word)
   }

   writeWordByPath(wordDir: string, word: Record<string, any>) {
      const tmp: Record<string, any> = fromRaw(word, Word)
      //   保存hooks文件
      if (tmp.hookScript)
         writeFile(escapePath(wordDir, this.daoConfig.WORD_HOOK_FILE), tmp.hookScript)
      tmp.hookScript = tmp.dictionary = undefined
      writeJson(escapePath(wordDir, this.daoConfig.WORD_INFO_FILE), tmp)
   }
}
