import { controller, inject, param, test } from "~/mainWindow/ioc.config";
import { MarkdownDao } from "../daos/MarkdownDao";


@controller('test::markdown')
export class Test {
   @inject('markdown-dao') declare markdownDao: MarkdownDao


   @test('get', [{ name: 'zs' }])
   test01(@param('name') name: string) {
      return name + ', 你好!'
   }

   @test('mapper', [])
   test02() {

   }
}
