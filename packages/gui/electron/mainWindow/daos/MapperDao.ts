import { component, inject } from '~/mainWindow/ioc.config';

import { forIn, fromRaw, isUniqueObject, Mapper } from '@ra2inier/core';
import {
   escapePath, readFile, readJson, writeFile, writeJson,
} from '@ra2inier/core/node';

import { DaoConfig } from './DaoConfig';

@component('mapper-dao')
export class MapperDao {

   @inject('dao-config') declare daoConfig: DaoConfig

   readMappersByPath(mapperDir: string) {
      const file: Record<string, string>[] = readJson(escapePath(mapperDir, this.daoConfig.MAPPER_FILE))
      const mappers: Record<string, Mapper> = {}
      const dir = escapePath(mapperDir)
      if (file instanceof Array)
         for (let mapper of file) {
            if (!isUniqueObject(mapper)) continue
            const tmp = fromRaw(mapper, Mapper)
            tmp.handlerScript = readFile(escapePath(dir, tmp.key + '.js'))
            mappers[tmp.key] = tmp
         }
      return mappers
   }

   writeMappersByPath(mapperDir: string, mappers: Record<string, Mapper>) {
      const tmp: Record<string, any>[] = []
      let t: any
      forIn(mappers, (key, mapper) => {
         t = fromRaw(mapper, Mapper)
         if (mapper.handlerScript)
            writeFile(escapePath(mapperDir, key + '.js'), mapper.handlerScript)
         t.handlerScript = undefined
         tmp.push(t)
      })
      writeJson(escapePath(mapperDir, this.daoConfig.MAPPER_FILE), tmp)
      return true
   }
}
