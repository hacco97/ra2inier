import { Package, PackageVo, Project, Reference, ReferenceWithPath, destruct, forIn, fromRaw, } from '@ra2inier/core';
import { downloadPackage, exec, useLogger } from '@/boot/apis';
import { createEmpty, ProjectBoot } from './boot';


/**
 * 对当前project实例进行操作的action
 */
export function createProjectAction(boot: ProjectBoot) {
	const logger = useLogger('project-action')
	const { mergePackages, checkPackage }
		= destruct(boot, ['mergePackages', 'checkPackage'])

	/**
	 * 保存项目的info文件
	 */
	async function saveProjectInfo() {
		if (boot.project.isEmpty) return logger.warn('请打开一个项目')
		const project = fromRaw(boot.project, Project, true)
		const pkg = fromRaw(boot.project.main, Package, true)
		const { status, data } = await exec('project/save-pkginfo', { project, pkg })
		if (!status) return logger.warn('保存包信息失败', data)
		logger.debug('保存包信息成功')
		return true
	}

	/**
	 * 从磁盘加载包
	 */
	async function importLocalPackage(references: ReferenceWithPath[]) {
		if (!references.length) return {}
		const { status, data } = await exec<Record<string, PackageVo>>('project/load-package', { data: references })
		if (!status) return void logger.warn('加载包出错', data) || {}
		await mergePackages(data)
		return data
	}


	/**
	 * 给定一个引用的集合，对该集合中的包进行加载
	 * 如果addMap中不包含已加载的某个包，那么这将删除已经加载的包
	 */
	async function updatePackage(addMap: Record<string, ReferenceWithPath>) {
		const [toAdd] = checkPackage(addMap)
		const pathMap = boot.project.referPathMap
		forIn(addMap, (key, r) => { pathMap[key] = r.path })
		const saved = await saveProjectInfo()
		if (!saved || !toAdd.length) return

		// 加载本地包
		const loaded = await importLocalPackage(<ReferenceWithPath[]>toAdd)

		// 检查哪些包需要下载
		const toDownload: Reference[] = []
		for (const r of toAdd) {
			if (r.key in loaded) continue
			if (r.url) toDownload.push(r)
		}
		if (toDownload.length <= 0) return
		const downloaded = <ReferenceWithPath[]>await downloadPackage(toDownload)
		const newLoaded = await importLocalPackage(downloaded)
		// console.log('正在下载')
		// TODO: 
	}

	/**
	 * 导入下载远程包
	 */
	function importRemotePackage(references: Reference[]) {
		theLogger.warn('方法没有实现', '导入远程包')
	}

	return {
		saveProjectInfo,
		updatePackage,
		importLocalPackage,
		importRemotePackage
	}
}

export const EMPTY_PROJECT_ACTION = createEmpty(createProjectAction)
