import fs, { Dirent, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * 将一个文件作为JSON读取
 */
export function readJson(path: string) {
   try {
      return JSON.parse(fs.readFileSync(path, 'utf-8'))
   } catch (_) { return {} }
}

/**
 * 将数据写做JSON格式的数据
 */
export function writeJson(path: string, object: any) {
   try {
      if (typeof object == 'string') writeFile(path, object)
      else writeFile(path, JSON.stringify(object))
      return true
   } catch (_) { return false }
}

/**
 * 读取一个文件，将其作为纯文本
 */
export function readFile(file: string) {
   try {
      return fs.readFileSync(file, 'utf-8')
   } catch (_) { return '' }
}

/**
 * 写文件，如果没有则自动创建
 */
export function writeFile(file: string, data: any) {
   try {
      const dir = dirname(file)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(file, data, { encoding: 'utf-8' })
      return true
   } catch (_) { return false }
}

/**
 * 移除文件
 */
export function removeFile(path: string) {
   try {
      if (existsSync(path))
         rmSync(resolve(path))
      return true
   } catch (error) {
      return false
   }
}

/**
 * 判读一个路径是否是目录
 */
export function isDirectory(path: string) {
   return fs.statSync(path).isDirectory()
}

/**
 * 得到一个使用'/'作为分隔的绝对路径
 */
export function escapePath(...paths: string[]) {
   return resolve(...paths).replaceAll('\\', '/')
}

/**
 * 遍历一个问价夹中的全部文件，自动跳过文件夹（或者文件）
 */
export function forDir(dir: string, cb: (filePath: string, dirent: Dirent) => void, fileOrDir = true) {
   if (fs.existsSync(dir))
      for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
         if (fileOrDir && file.isFile()) {
            cb(escapePath(dir, file.name), file)
         } else if (!fileOrDir && file.isDirectory()) {
            cb(escapePath(dir, file.name), file)
         }
      }
}

