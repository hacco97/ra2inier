import { Markdown } from "../entity/Markdown";
import { UniqueObject } from "../entity/Obejct";
import { MarkdownVo } from "../vo/ObjectVo";


export class MarkdownRo extends UniqueObject {
   raw: string = ''

   // 图片的名字：图片数据
   images: Record<string, Uint8Array> = {}

   md: string = ''
   urls: Record<string, string> = {}
}
