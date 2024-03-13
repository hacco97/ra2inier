import { exec } from "./apis"


/**
 * 打开文件系统
 */
export async function openDirectory() {
   const { status, data } = await exec<string[]>('dialog/open/dirs', { modal: true })
   if (status) return data
}
