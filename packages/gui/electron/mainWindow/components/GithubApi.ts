import { component, inject } from "../ioc.config";
import axios, { AxiosInstance, AxiosProgressEvent } from "axios";
import { Config } from "@ra2inier/core";
import { createWriteStream } from "node:fs";

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
            'User-Agent': 'ra2inier/0.0.0', // 用户代理
            'Cache-Control': 'no-cache'
         }
      })
      ins.interceptors.request.use((r) => {
         console.log(r.headers)
         return r
      })
   }

   /**
    * @param url github的仓库地址
    * @param path 下载到的本地路径
    */
   async downloadPackage(
      url: string,
      path: string,
      onProgress?: (progressEvent: AxiosProgressEvent) => void,
   ) {
      const ws = createWriteStream(path)
      return this.#api(url, {
         responseType: 'stream',
         onDownloadProgress: onProgress
      }).then(r => {
         r.data.pipe?.(ws)
         return true
      }).catch(() => {
         return false
      }).finally(() => { ws.close() })
   }
}
