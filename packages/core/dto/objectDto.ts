import { Mapper } from "../entity/Mapper"
import { IniObject, UniqueObject } from "../entity/Obejct"
import { Scope } from "../entity/Scope"
import { Word } from "../entity/Word"


export class IniObjectDto extends IniObject {

}


export class ScopeDto extends Scope {

}


export class WordDto extends Word {
   declare detail: string
   declare markdown: MarkdownDto
}


export class MarkdownDto extends UniqueObject {
   raw: string = ''

   // 图片的名字
   images: Record<string, Uint8Array> = {}
}

export class MapperDto extends Mapper {

}
