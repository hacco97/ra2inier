import { component, inject } from "../ioc.config";
import axios, { AxiosInstance, AxiosProgressEvent } from "axios";
import { Config } from "@ra2inier/core";
import { cpSync, createReadStream, createWriteStream, mkdirSync, readdirSync, rmSync } from "node:fs";
import { Transform } from "node:stream";
import { dirname } from "node:path";
import { pipeline } from "node:stream/promises";
import { escapePath } from "@ra2inier/core/node";
import { mkdir } from "node:fs/promises";
import { zip } from 'compressing'

@component('api::github')
export class GithubApi {

	@inject('app-config') declare appConfig: Config

	#api: AxiosInstance

	constructor() {
		const ins = this.#api = axios.create({
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/zip',  // 关键参数
				'Accept-Encoding': 'gzip, deflate, br, zstd',   // 可以接受的的类型
				'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
				'User-Agent': 'ra2inier/0.0.1', // 用户代理
				"Keep-Alive": 'false'
			}
		})
	}

	#postFix = '/archive/refs/heads/main.zip'

	/**
	 * @param url github的仓库地址
	 * @param targetPath 下载文件的最后保存的文件路径，最后是一个文件夹
	 */
	async downloadPackage(
		url: string,
		targetPath: string,
		onProgress?: (progressEvent: AxiosProgressEvent) => void,
	) {
		// 下载zip文件到'path'路径上
		const res = await this.#api.get<Transform>(url + this.#postFix, {
			responseType: 'stream',
			onDownloadProgress: onProgress,
		})
		if(!res.status) return false
		targetPath = escapePath(targetPath)
		const targetDir = dirname(targetPath)
		const tmpZip = targetDir + '/ra2inier_tmp_' + Math.random()
		mkdirSync(targetDir, { recursive: true })
		const ws = createWriteStream(tmpZip)
		await pipeline(res.data, ws)
		ws.close()

		// 解压文件到space文件夹中
		const space = targetDir + '/ra2inier_tmp_' + Math.random()
		await mkdir(space, { recursive: true })
		await zip.decompress(createReadStream(tmpZip), space)

		// 重命名为目标文件夹
		const [_1] = readdirSync(space)
		const from = escapePath(space, _1)
		cpSync(from, targetPath, { recursive: true })

		// 删除临时文件
		rmSync(tmpZip, { recursive: true })
		rmSync(space, { recursive: true })
		return true
	}

	async getPackageVersion(url: string) {
		
	}
}
