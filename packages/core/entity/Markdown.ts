import { IUniqueObject, UniqueObject } from "./Obejct";

export class Markdown extends UniqueObject {

   raw: string = ''

   /**
    * key图片的名，val图片数据
    */
   images: Record<string, Buffer> = {}

}
