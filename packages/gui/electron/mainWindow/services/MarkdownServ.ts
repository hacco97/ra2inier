import { Markdown, MarkdownVo } from "@ra2inier/core";
import { inject, mapping, pathVar, controller, param } from "~/mainWindow/ioc.config";
import { MarkdownDao } from "../daos/MarkdownDao";
import fs from 'node:fs'


@controller('markdown')
export class MarkdownServ {
   @inject('markdown-dao') declare markdownDao: MarkdownDao

   getMarkdownByPath(mdPath: string): MarkdownVo {
      if (fs.existsSync(mdPath))
         return this.markdownDao.readMarkdownByPath(mdPath)
      return new Markdown
   }

   @mapping('get')
   getMarkdownByKey(@pathVar key: string) {
      const res = this.markdownDao.readMarkdownByKey(key)
      if (!res) throw Error('没有该markdown对象，key：' + key)
      return res
   }

   @mapping('save')
   saveMarkdown(@param('md') markdown: Markdown) {
      console.log(markdown)
   }

}
