import { controller, inject, mapping, param } from '~/mainWindow/ioc.config';

import { StaticDao } from '../daos/StaticDao';

@controller('static')
export class StaticServ {

   @inject('static-dao') declare staticDao: StaticDao

   @mapping('packages')
   getGlobalPackages(@param('index') isIndex: string) {
      if (isIndex) {
         return this.staticDao.readGlobalPackagesList()
      } else {
         return {
            hello: 'world'
         }
      }
   }
}
