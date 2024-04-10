import { controller, inject, mapping, param } from '~/mainWindow/ioc.config';

import { StaticDao } from '../daos/StaticDao';
import { PackageDao } from '../daos/PackageDao';

@controller('static')
export class StaticServ {

   @inject('static-dao') declare staticDao: StaticDao
   @inject('package-dao') declare packageDao: PackageDao

   @mapping('packages')
   getGlobalPackages(@param('index') isIndex: string) {
      if (!isIndex) return {}
      return this.staticDao.readGlobalPackages()
   }

   @mapping('package')
   getPackageByPath(@param('paths') paths: string[]) {
      const ret = []
      for (let path of paths || []) {
         const tmp = (this.packageDao.readPackageInfoByPath(path))
         tmp && ret.push(tmp)
      }
      return ret
   }
}
