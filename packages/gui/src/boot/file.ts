import { Package, Pipe, Reference } from "@ra2inier/core"
import { exec } from "./apis"


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
   throw Error('打开包文件夹失败')
}).catch(x => []).value


/**
 * 下载远程包，下载的时候会检查是否存在url属性如果不存在，则不会进行下载
 */
export async function downloadPackage(refers: Reference[]) {
   refers = refers.filter(x => !!x.url)
   if (!refers.length) return []
   const { status, data } = await exec('download/remote-package', { data: refers, timeout: 999_999_999_999 })
   if (!status) return []
   return <Reference[]>data
}
