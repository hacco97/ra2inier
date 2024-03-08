import fs, { Dirent } from 'node:fs';

import { component, inject } from '~/mainWindow/ioc.config';

import { forIn, Markdown, UniqueObject } from '@ra2inier/core';
import { escapePath, readFile, writeFile } from '@ra2inier/core/node';

import { DaoConfig } from './DaoConfig';

// markdown 文件被抽象成为一个文件夹，传入读取的时候使用md文件的地址，外界访问markdown使用key值来进行访问，key值和路径地址之间使用

const FILTER_FOR_IMAGE_READING = {
   jpg: "", jpeg: '',
   png: '', apng: "",
   webp: '',
   ico: '', cur: '',
   gif: "",
   tif: '', tiff: "",
   svg: '',
   avif: '',
   bmp: ''
}

const FILTER = (file: Dirent) => {
   try {
      return file.name.split('.')[1] in FILTER_FOR_IMAGE_READING
   } catch (_) {
      return false
   }
}


function findImages(dir: string) {
   let images = fs.readdirSync(dir, { withFileTypes: true })
   images = images.filter(FILTER)
   return images.map((file) => file.name)
}



@component('markdown-dao')
export class MarkdownDao {
   @inject('dao-config') declare config: DaoConfig

   // key:path
   markdownKeyMap: Record<string, string> = {}
   //path:markdown cache
   markdownPathMap: Record<string, Markdown> = {}

   connectToPath(path: string) {
      const tmp = new UniqueObject
      this.markdownKeyMap[tmp.key] = path
      return tmp.key
   }

   hasKey(key: string) {
      return key in this.markdownKeyMap
   }

   touch(path: string) {
      if (!(path in this.markdownPathMap))
         this.readMarkdownByPath(path)
      const tmp = (new UniqueObject).key
      this.markdownKeyMap[tmp] = path
      return tmp
   }

   add(path: string, markdown: Markdown) {
      this.markdownKeyMap[markdown.key] = path
      this.markdownPathMap[path] = markdown
   }

   readMarkdownByKey(key: string) {
      if (key in this.markdownKeyMap) {
         const path = this.markdownKeyMap[key]
         if (!(path in this.markdownPathMap)) {
            const id = parseInt(key.split('@')[0])
            const version = parseInt(key.split('@')[1])
            this.markdownPathMap[path] = this.readMarkdownByPath(path, id, version)
         }
         return this.markdownPathMap[path]
      }
   }

   readMarkdownByPath(mdPath: string, id = Date.now(), version = Date.now()): Markdown {
      if (this.markdownPathMap[mdPath])
         return this.markdownPathMap[mdPath]
      mdPath = escapePath(mdPath)
      const dir = escapePath(mdPath, '..')
      const tmp = new Markdown(undefined, id, version)
      tmp.raw = readFile(mdPath)
      for (const name of findImages(dir)) {
         tmp.images[name] = fs.readFileSync(escapePath(dir, name))
      }
      this.markdownKeyMap[tmp.key] = mdPath
      this.markdownPathMap[mdPath] = tmp
      return tmp
   }

   writeMarkdownByPath(mdPath: string, md: Markdown) {
      this.markdownPathMap[mdPath] = md
      writeFile(mdPath, md.raw)
      const dir = escapePath(mdPath, '..')
      forIn(md.images, (key, val) => {
         fs.writeFileSync(escapePath(dir, key), val)
      })
   }

   writeMarkdownByKey(key: string) {
      if (!(key in this.markdownKeyMap)) return false
      const path = this.markdownKeyMap[key]
      if (!this.markdownPathMap[path]) return false
      this.writeMarkdownByPath(path, this.markdownPathMap[path])
      return true
   }
}
