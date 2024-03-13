import { component, inject } from "../ioc.config";
import axios, { AxiosInstance } from "axios";
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

   downloadPackage(url: string, path: string) {
      const ws = createWriteStream(path)
      this.#api(url, {
         responseType: 'stream',
         onDownloadProgress(progressEvent) {
            console.log(progressEvent)
         },
      }).then(r => {
         r.data.pipe?.(ws)
      })
   }
}
