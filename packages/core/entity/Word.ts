import { UniqueObject } from './Obejct';

export class Word extends UniqueObject {
   /**
    *  概要
    */
   brief: string = ''
   /**
    * 默认值，纯文本
    */
   default: string = ''
   /**
    * 作者信息表达式
    */
   author: string = ''
   /**
    * 可以在哪些文件下使用，纯文本
    */
   files: string[] = []
   /**
    * 字典的名称，使用的是该word的父文件夹的名字
    */
   dictionary: string = 'custom'
   /**
    * 一个使用'values表达式语法'的字符串
    */
   values: string = ''
   /**
    * word的类型参数
    */
   valueParam: WordValueTypeParam[] = []
   /**
    * 决定在哪些scope下进行使用,scopes的key值
    */
   scopes: string[] = []
   /**
    * js代码 纯文本值
    */
   hookScript: string = ''
}

/**
 * values 表达式语法
   bool,bool(),bool('为真时的解释','为假时的解释')
   int(,下界),int(上界,),int(下界,上界)   闭区间
   float(下界,上界)    闭区间
   str,str(),str(正则表达式)
   enum(可能的值1,可能的值2),  enum(可能的值1:值1解释,可能的值2:值2解释)
   obejct(scope名字)
   color()

   *号，表示一个类型的数值的重复次数,
   int()*3,表示三个数字，多个类型参数中间用逗号分割，只有最后一个参数可以使用可变参数
 */
export enum WordValueType {   // 定义输入框UI种类
   /**
    * 字符串类型，无验证
    */
   str = 'str',

   int = 'int',
   float = 'float',

   /**
    * 枚举类型，可以让UI界面生成下拉选择框
    */
   bool = 'bool',
   enum = 'enum',
   /**
    * 对象类型，可以让UI界面生成下拉选择框，去project里面寻找相应的对象
    */
   obj = 'obj',

   color = 'color',

   /**
    * 解析错误的类型
    */
   unknown = 'unknown'
}


export interface WordValueTypeParam {
   exp: string,
   type: WordValueType,

   /**
    * 类型为bool和enum时的参数
    */
   optiontmp?: string[]
   optionRemarks?: string[]

   /**
    * 类型为int和float的时候的参数
    */
   max?: number
   min?: number

   /**
    * 型为字符串的时候的参数
    */
   regex?: string

   objectType?: string
   repeat?: number
}

/**
 * 钩子脚本默认模板
 */
export const HOOK_FILE_TEMPLATE = `\
function validate(val, ctx) {

}

function translate(values, ctx) {

}

function adjust(entrys, ctx) {

}

function output(val, ctx) {

}`
