import { Config, Package } from '@ra2inier/core';
import { escapePath, forDir } from '@ra2inier/core/node';

import { component, inject } from '../ioc.config';
import { DaoConfig } from './DaoConfig';
import { PackageDao } from './PackageDao';

@component('static-dao')
export class StaticDao {

   @inject('dao-config') declare daoConfig: DaoConfig
   @inject('app-config') declare appConfig: Config
   @inject('package-dao') declare packageDao: PackageDao

   readGlobalPackagesList() {
      const dir = escapePath(this.appConfig.GLOBAL_PACKAGE_DIR)
      const packages: Record<string, Package> = {}
      forDir(dir, (path, dirent) => {
         const pkg = this.packageDao.readPackageInfoByPath(path)
         pkg && (packages[pkg.key] = pkg)
      }, false)
      return packages
   }
}
