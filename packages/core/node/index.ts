import fs, { Dirent } from 'node:fs'
import { resolve, dirname } from 'node:path'

export function readJson(path: string) {
   try {
      return JSON.parse(fs.readFileSync(path, 'utf-8'))
   } catch (_) { return {} }
}

export function readFile(file: string) {
   try {
      return fs.readFileSync(file, 'utf-8')
   } catch (_) { return '' }
}

export function writeFile(file: string, data: any) {
   try {
      const dir = dirname(file)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(file, data, { encoding: 'utf-8' })
      return true
   } catch (_) { return false }
}

export function isDirectory(path: string) {
   return fs.statSync(path).isDirectory()
}

export function escapePath(...paths: string[]) {
   return resolve(...paths).replaceAll('\\', '/')
}

export function writeJson(path: string, object: any) {
   try {
      if (typeof object == 'string') writeFile(path, object)
      else writeFile(path, JSON.stringify(object))
      return true
   } catch (_) { return false }
}

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

