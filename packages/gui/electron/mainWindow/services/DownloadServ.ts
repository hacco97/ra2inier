import { controller, inject, mapping, param } from "../ioc.config";
import { GithubApi } from "../components/GithubApi";
import { escapePath } from "@ra2inier/core/node";
import { Config, MapIn, Package, PackageVo, Reference, forIn, fromRaw } from "@ra2inier/core";
import { FrontLogger } from "~/ioc/frontEnd";
import { StaticDao } from "../daos/StaticDao";
import { existsSync } from 'node:fs'
import { PackageDao } from "../daos/PackageDao";

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
		const globalPackages = this.staticDao.readDownloadedPackages()
		const urlMap: Record<string, PackageVo> = {}
		forIn(globalPackages, (_, pkg) => urlMap[pkg.url] = pkg)
		for (const refer of refers) {
			if (refer.url in urlMap || refer.key in globalPackages) {
				// TODO: 检查版本

				continue
			}
			let tmpName = '.' + String(refer.name || Math.random())
			const path = escapePath(this.appConfig.GLOBAL_PACKAGE_CACHE, tmpName)
			let count = 1, tmpPath = path
			while (existsSync(tmpPath)) {
				tmpPath = path + count++
				tmpName += count
			}
			const res = await this.api.downloadPackage(refer.url, tmpPath)
			if (!res) continue
			const downloaded = this.packageDao.readPackageInfoByPath(tmpPath)
			downloaded && ret.push(fromRaw(downloaded, Package))
		}
		return ret
	}

}
