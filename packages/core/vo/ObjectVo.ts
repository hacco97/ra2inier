import { IniObject, UniqueObject } from "../entity/Obejct";
import { Scope } from "../entity/Scope";
import { Word } from "../entity/Word";
import { Mapper } from "../entity/Mapper";

export interface IniObjectVo extends IniObject { }

export interface ResourceVo extends UniqueObject { }

export interface ScopeVo extends Scope { }

export interface WordVo extends Word {
	detail: string   // 一个markdown对象的key值
}

export interface MapperVo extends Mapper { }

export interface MarkdownVo extends UniqueObject {
	raw: string

	// 图片的名字
	images: Record<string, Uint8Array>
}
