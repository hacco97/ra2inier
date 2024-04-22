import { Config, Package, PackageVo, useMemo } from '@ra2inier/core';
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
			...this.readDownloadedPackages()
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
	 * 读取所有本地缓存仓库中包的info文件
	 * key： package<Package>
	 */
	readDownloadedPackages = useMemo(() => {
		const dir = escapePath(this.appConfig.GLOBAL_PACKAGE_CACHE)
		return this._readPackages(dir)
	}, undefined, 1000 * 9)[0]

	/**
	 * 读取默认项目文件夹中的包的info文件
	 */
	readDefaultDirPackages() {
		const dir = escapePath(this.appConfig.DEFAULT_PROJECT_DIR)
		return this._readPackages(dir)
	}

	private _readPackages(dir: string) {
		const packages: Record<string, PackageVo> = {}
		forDir(dir, (path, dirent) => {
			const pkg = this.packageDao.readPackageInfoByPath(path)
			pkg && (packages[pkg.key] = pkg)
		}, false)
		return packages
	}

	/**
	 * 传入一个url根据url来判断全局是否已经存在该包了，
	 * 如果存在则直接返回该包，否则返回undefined
	 */
	checkPackageByUrl(url: string[]) {
		const cache = this.readDownloadedPackages()
		
	}
}
