import { component, inject } from "../ioc.config";
import axios, { AxiosInstance, AxiosProgressEvent, AxiosResponse } from "axios";
import { Config } from "@ra2inier/core";
import { createWriteStream, rmSync } from "node:fs";
import { Transform } from "node:stream";
import AdmZip from 'adm-zip'
import { dirname, resolve } from "node:path";

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
            'Cache-Control': 'no-cache'
         }
      })
      ins.interceptors.request.use((r) => {
         console.log(r.headers)
         return r
      })
   }


   #postFix = '/archive/refs/heads/main.zip'

   /**
    * @param url github的仓库地址
    * @param path 下载文件的本地路径，需要包括文件名
    */
   async downloadPackage(
      url: string,
      path: string,
      onProgress?: (progressEvent: AxiosProgressEvent) => void,
   ) {
      return new Promise(async (r, j) => {
         url += this.#postFix
         path = resolve(path) + Math.random()
         const ws = createWriteStream(path)
         const res = await this.#api.get<Transform>(url, {
            responseType: 'stream',
            onDownloadProgress: onProgress
         })
         res.data.pipe?.(ws)
         ws.addListener('close', () => {
            const adm = new AdmZip(path)
            adm.extractAllTo(dirname(path))
            rmSync(path)
            r(true)
         })
         ws.addListener('error', (e) => { j(e) })
      })
   }
}
