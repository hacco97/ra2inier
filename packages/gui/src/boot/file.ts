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
export async function showInFileFloder(path: string) {
   exec('dialog/show', { path })
}
