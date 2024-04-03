import fs from 'node:fs';

import { Entry, fromRaw, IniObject } from '@ra2inier/core';
import { escapePath, writeFile } from '@ra2inier/core/node';

import { component, inject } from '../ioc.config';
import { DaoConfig } from './DaoConfig';

@component('object-dao')
export class ObjectDao {
   @inject('dao-config') declare config: DaoConfig

   // 缓存 object的key值：object的文件路径
   #objectsPathMap: Record<string, string> = {}
   readObjectByPath(objectPath: string) {
      try {
         let tmp: any = fs.readFileSync(objectPath, 'utf-8')
         tmp = fromRaw(JSON.parse(tmp, this.parseV1), IniObject)
         this.#objectsPathMap[tmp.key] = objectPath
         return <IniObject>tmp
      } catch (error) { return undefined }
   }

   writeObjectByPath(objectPath: string, object: IniObject) {
      try {
         writeFile(objectPath, JSON.stringify(object, this.stringifyV1))
      } catch (error) { return false }
   }

   deleteObjectByPath(pkgPath: string, key: string) {
      const path = this.#objectsPathMap[key]
      if (path && path.startsWith(escapePath(pkgPath))) {
         fs.rmSync(path)
         delete this.#objectsPathMap[key]
         return true
      }
      return false
   }

   private parseV1(key: string, val: any) {
      if (key !== 'entry') return val
      const ret = []
      for (const item of val) {
         const [ekey, valueStr, comment] = item.split('\n\n')
         ret.push({
            wordName: ekey,
            values: valueStr.split('\n'),
            comment
         })
      }
      return ret
   }

   private stringifyV1(key: string, val: any) {
      if (key !== 'entry') return val
      const entrys: string[] = []
      for (const item of <Entry[]>val) {
         entrys.push(`${item.wordName}\n\n${item.values.join('\n')}${item.comment ? '\n\n' + item.comment : ''}`)
      }
      return entrys
   }

}
