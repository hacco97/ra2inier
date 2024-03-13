import { controller, inject, mapping, param } from '~/mainWindow/ioc.config';

import { StaticDao } from '../daos/StaticDao';

@controller('static')
export class StaticServ {

   @inject('static-dao') declare staticDao: StaticDao

   @mapping('packages')
   getGlobalPackages(@param('index') isIndex: string) {
      if (isIndex) {
         const tmp = this.staticDao.readGlobalPackagesList()
         return tmp
      } else {
         return {
            hello: 'world'
         }
      }
   }
}
