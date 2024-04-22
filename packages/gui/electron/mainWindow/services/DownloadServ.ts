import { controller, inject, mapping, param } from "../ioc.config";
import { GithubApi } from "../components/GithubApi";
import { Config, Package, PackageVo, Reference, forIn } from "@ra2inier/core";
import { FrontLogger } from "~/ioc/frontEnd";
import { StaticDao } from "../daos/StaticDao";
import { existsSync } from 'node:fs'
import { PackageDao } from "../daos/PackageDao";
import { resolve } from "node:path";
import { escapePath } from "@ra2inier/core/node";

const GITHUB_URL = /^https:\/\/.*github\.com\/.+/
const IS_URL = ({ url }: { url: string }) => {
	url = url.trim()
	return Boolean(url.match(GITHUB_URL))
}

@controller('download')
export class DownloadServ {

	@inject('api::github') declare api: GithubApi
	@inject('app-config') declare appConfig: Config
	@inject('front-logger') declare private frontLogger: FrontLogger
	@inject('static-dao') declare private staticDao: StaticDao
	@inject('package-dao') declare private packageDao: PackageDao

	/**
	 * 传入一组Reference对象，下载这些包
	 */
	@mapping('remote-package')
	async downloadRemotePackage(@param('data') refers: Reference[]) {
		refers = refers.filter(IS_URL)
		const ret: Package[] = []
		if (refers.length < 1) return ret
		// 检查本地包中是否存在，存在则不下载
		const globalPackages = this.staticDao.readDownloadedPackages()
		const urlMap: Record<string, PackageVo> = {}
		forIn(globalPackages, (_, pkg) => urlMap[pkg.url] = pkg)
		for (const refer of refers) {
			if (refer.url in urlMap || refer.key in globalPackages) {
				// TODO: 检查版本
				/*
				  因为远程包可能不知道版本
				  则无version字段直接下
				  有version则如果本地的版本低于所需版本时下载
				*/
				// if(refer.version)
				ret.push(urlMap[refer.url] || globalPackages[refer.key])
				continue
			}
			const path = this.mallocNewPackagePath(refer)
			const res = await this.api.downloadPackage(refer.url, path)
			if (!res) continue

			// 检查下载的包是否合法
			const downloaded = this.packageDao.readPackageInfoByPath(path)
			if (!downloaded) {
				this.packageDao.removePackageByPath(path)
				continue
			}

			// 合法后修改其url属性
			downloaded.url = refer.url
			this.packageDao.writePackageInfoByPath(downloaded, path)
			this.frontLogger.debug('下载包成功', downloaded.fullname)
			ret.push(downloaded)
		}
		return ret
	}

	private mallocNewPackagePath(refer: Reference) {
		const pkgName = String(refer.name || Math.random())
		const cacheDir = this.appConfig.GLOBAL_PACKAGE_CACHE
		let tmpName = pkgName, count = 1
		if (existsSync(resolve(cacheDir, tmpName)))
			tmpName += refer.version
		while (existsSync(resolve(cacheDir, tmpName))) {
			tmpName = pkgName + count++
		}
		return escapePath(cacheDir, tmpName)
	}
}
