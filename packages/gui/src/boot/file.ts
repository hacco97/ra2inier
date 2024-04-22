import { Package, PackageVo, Pipe, Reference } from "@ra2inier/core"
import { exec, useLogger } from "./apis"

const logger = useLogger('static-store')

/**
 * 打开文件夹选择窗口
 */
export async function openDirectory(path?: string) {
	const { status, data } = await exec<string[]>('dialog/open/dirs', { modal: true, path })
	if (status) return data
}

/**
 * 在文件夹中显示
 */
export async function showInFileBroser(path: string) {
	exec('dialog/show', { path })
}


/**
 * 读取一个文件夹，将该文件夹视为一个Package，获得一个Package对象
 */
export const readPackageDir = new Pipe(async (paths: string[]) => {
	const { status, data } = await exec<(Package & { path: string })[]>('static/package', { paths })
	if (status && data[0]) return data
	logger.warn('打开包文件夹失败')
	throw Error('打开包文件夹失败')
}).catch(x => []).value


/**
 * 下载远程包，下载的时候会检查是否存在url属性如果不存在，则不会进行下载
 */
export async function downloadPackage(refers: Reference[]) {
	refers = refers.filter(IS_URL)
	if (!refers.length) return []
	const msg = refers.map(_f).join('\n')
	logger.info('正在下载包', msg)
	const { status, data, detail } = await exec<Package[]>('download/remote-package',
		{ data: refers, timeout: 1000 * 60 * 60 * 24 })
	if (status && data.length > 0) {
		const msg = data.map(_f).join('\n')
		logger.debug('包下载成功', msg)
		return data
	}
	logger.warn('包下载失败', detail || data)
	return []
}
const _f = (x: any, id: any) => `${id + 1}：${x.name}(${x.url})`
const GITHUB_URL = /^https:\/\/.*github\.com\/.+/
const IS_URL = ({ url }: { url: string }) => {
	url = url.trim()
	let tmp = Boolean(url.match(GITHUB_URL))
	tmp || logger.warn('包链接不正确', url)
	return tmp
}
