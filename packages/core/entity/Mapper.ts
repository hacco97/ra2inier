import { UniqueObject } from './Obejct';

interface HandlerCtx {
   [s: string]: any

}

/**
 * Input处理函数，在每个对象被送入Mapper时调用，由对象的scope对应的handler来处理该对象
 */
export type InputHandler = (results: string[][], data: Object, ctx: HandlerCtx) => void

/**
 * output处理函数，在所有对象被统计完成之后，最后生成文件时被调用
 */
export type OutputHandler = (data: Object, ctx: HandlerCtx) => void

/**
 * 起始处理器，在一个文件即将开始处理之前进行调用
 */
export type StartHandler = (data: Object, ctx: HandlerCtx) => void

/**
 * 结束处理器，必须填写的函数，如果没有该函数，则输出结果无法进行结算
 */
export type FinalOutput = string | ([string, string] | string)[] | Record<string, Record<string, string>>
export type FinalHandler = (data: Object, ctx: HandlerCtx) => FinalOutput

export type MapperHandler = InputHandler | OutputHandler | StartHandler | FinalHandler

export class Mapper extends UniqueObject {
   detail: string = ''
   targetPath: string = '.'

   /**
    * 字符串为scope的名字值和匹配规则，OnInput为处理该scope的输入Mapper函数的名字
    */
   inputList: Record<string, string> = {}
   // 保存多个outputHandler，在处理时依次调用
   outputList: string[] = []
   //保存handler代码的js文件内容
   handlerScript: string = ''
}
