import { IUniqueObject, UniqueObject } from './Obejct';

export type YesOrNo = 'yes' | 'no'

export interface GameEnv {
   ra2?: YesOrNo,
   yr?: YesOrNo,
   mo3?: YesOrNo,
   inier?: YesOrNo,
   [s: string]: string | undefined
}


/**
 * 对象实例作用域：
 * singleton：单例模式，如果一个项目存在两个该类型的同名对象，将会报错；
 * prototype：多例模式，项目中可以存在多个同名的对象，并且会被同时输出；
 * inherit：继承模式，以引用的项目中的同名对象为准；
 * override：覆盖模式，以本项目中的数值为准；
 */
export type ScopeType = 'singleton' | 'prototype' | 'inherit' | 'override'

export class Scope extends UniqueObject {
   brief: string = ''
   files: string[] = []
   env: Record<string, boolean> = {}
   detail: string = ''
   mappers: string[] = []

   /**
    * 作用域类型：默认为多例 prototype
    */
   type?: ScopeType
}
