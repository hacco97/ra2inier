import {
  fromRaw, IniObject, IniObjectRo, isUniqueObject, objectTranslator,
} from '@ra2inier/core';

import { on } from '../apis';
import { objects, setObject } from '../boot';
import { checkWordHook, createCtx, createTranslateReferWords } from './build';

// 对象同步
on('object/sync', async ({ data }: { data: IniObject[] }) => {
   for (let object of data) {
      if (!isUniqueObject(object)) continue
      const tmp = fromRaw(object, IniObjectRo)
      // objects[tmp.key] = tmp
      setObject(tmp.key, tmp)
   }
})


// 单对象翻译逻辑
export function doTranslateObject(object: IniObjectRo) {
   if (!object) throw Error('对象不合法：' + object)
   const words = createTranslateReferWords(object.entry)
   for (const name in words) { checkWordHook(words[name]) }
   const ret = objectTranslator(object, words, createCtx())
   return ret
}

on('object/translate', async ({ objectKey }: { objectKey: string }) => {
   const object = objects[objectKey]
   const ret = doTranslateObject(object)
   return ret
})
