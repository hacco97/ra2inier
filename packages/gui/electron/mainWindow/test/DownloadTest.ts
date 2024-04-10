import { GithubApi } from "../components/GithubApi";
import { controller, inject, mapping, test } from "~main/ioc.config";

@controller('test::download')
export class Download {
   @inject('api::github') declare private api: GithubApi

   demoUrl = 'https://github.com/ra2inier/debug-project'
   demoTarget = './custom/reference/demo-package'

   @test('download')
   async testDownload() {
      return await this.api.downloadPackage(this.demoUrl, this.demoTarget, (x) => {
         console.log(x.progress)
      })
   }

   @mapping('dfsf')
   tefs() {
      throw Error('dfs')
   }
}
