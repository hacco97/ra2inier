import { IUniqueObject, UniqueObject } from "./Obejct";


export type YesOrNo = 'yes' | 'no'

export interface GameEnv {
   ra2?: YesOrNo,
   yr?: YesOrNo,
   mo3?: YesOrNo,
   inier?: YesOrNo,
   [s: string]: string | undefined
}


export interface Scope extends IUniqueObject { }
export class Scope extends UniqueObject {
   brief: string = ''
   files: string[] = []
   env: Record<string, boolean> = {}
   detail: string = ''
   mappers: string[] = []
}
