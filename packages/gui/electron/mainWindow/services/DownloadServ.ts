import { controller, test, inject } from "../ioc.config";
import { GithubApi } from "../components/GithubApi";

@controller('download')
export class DownloadServ {

   @inject('api::github') declare api: GithubApi

   demoUrl = 'https://codeload.github.com/ra2inier/debug-project/zip/refs/heads/main'


   @test('down', [
      { url: "" }
   ])
   async downloadPackage(url: string) {
      this.api.downloadPackage(this.demoUrl, 'x1.zip')

      return ''
   }
}
