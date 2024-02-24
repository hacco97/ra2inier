import { resolve } from 'node:path';

import { component, inject } from '~/mainWindow/ioc.config';

import { forIn, fromRaw, isUniqueObject, Mapper } from '@ra2inier/core';
import { readFile, readJson, writeFile, writeJson } from '@ra2inier/core/node';

import { DaoConfig } from './DaoConfig';

@component('mapper-dao')
export class MapperDao {

   @inject('dao-config') declare daoConfig: DaoConfig

   readMappersByPath(mapperDir: string) {
      const file: Record<string, string>[] = readJson(resolve(mapperDir, this.daoConfig.MAPPER_FILE))
      const mappers: Record<string, Mapper> = {}
      const dir = resolve(mapperDir)
      if (file instanceof Array)
         for (let mapper of file) {
            if (!isUniqueObject(mapper)) continue
            const tmp = fromRaw(mapper, Mapper)
            tmp.handlerScript = readFile(resolve(dir, tmp.key + '.mjs'))
            mappers[tmp.key] = tmp
         }
      return mappers
   }

   writeMappersByPath(mapperDir: string, mappers: Record<string, Mapper>) {
      const tmp: Record<string, any>[] = []
      let t: any
      forIn(mappers, (key, mapper) => {
         t = fromRaw(mapper, Mapper)
         writeFile(resolve(mapperDir, key + '.mjs'), mapper.handlerScript)
         t.handlerScript = undefined
         tmp.push(t)
      })
      writeJson(resolve(mapperDir, this.daoConfig.MAPPER_FILE), tmp)
      return true
   }
}
