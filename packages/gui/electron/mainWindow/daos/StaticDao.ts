import { Config, Package } from '@ra2inier/core';
import { escapePath, forDir } from '@ra2inier/core/node';

import { component, inject } from '../ioc.config';
import { DaoConfig } from './DaoConfig';
import { PackageDao } from './PackageDao';
import { GithubApi } from '../components/GithubApi';

@component('static-dao')
export class StaticDao {

   @inject('dao-config') declare daoConfig: DaoConfig
   @inject('app-config') declare appConfig: Config
   @inject('package-dao') declare packageDao: PackageDao
   @inject('api::github') declare githubApi: GithubApi

   /**
    * 读取所有全局包的info文件，包括内建和缓存
    * key： package<Package>
    */
   readGlobalPackages() {
      return {
         ...this.readGlobalBuildinPackages(),
         ...this.readGlobalPackagesCache()
      }
   }

   /**
    * 读取所有全局内建包的info文件
    * key： package<Package>
    */
   readGlobalBuildinPackages() {
      const dir = escapePath(this.appConfig.GLOBAL_PACKAGE_DIR)
      return this._readPackages(dir)
   }

   /**
    * 读取所有本地仓库中的缓存包的info文件
    * key： package<Package>
    */
   readGlobalPackagesCache() {
      const dir = escapePath(this.appConfig.GLOBAL_PACKAGE_CACHE)
      return this._readPackages(dir)
   }

   private _readPackages(dir: string) {
      const packages: Record<string, Package> = {}
      forDir(dir, (path, dirent) => {
         const pkg = this.packageDao.readPackageInfoByPath(path)
         pkg && (packages[pkg.key] = pkg)
      }, false)
      return packages
   }

   downloadPackage(url: string) {
      if (!url) return
      const path = escapePath(this.appConfig.GLOBAL_PACKAGE_CACHE)
      this.githubApi.downloadPackage(url, path).then((ret) => {

      })
   }
}
