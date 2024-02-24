import {
  HookCtx, StatusCode, WordRo, WordValidity, WordValueType,
  WordValueTypeParam,
} from '@ra2inier/core/boot';

/**
 * 默认的词条检验函数，基于values表达式进行校验
 */
export function defaultValuesValidator(word: WordRo, values: string[]) {
   const params = word.valueParam
   const validitys: WordValidity[] = []
   const repeat = params.map(param => {
      // @ts-ignore
      const r = parseInt(param.repeat)
      return r > 0 ? r : 1
   })
   for (let i = 0, j = 0; i < params.length && j < values.length; j++) {
      validitys.push(defaultValueValidator(params[i], values[j]))
      if (--repeat[i] < 1) i++
   }
}


const BOOL_SET = new Set(['yes', 'no', 'true', 'false', '1', '0'])
function defaultValueValidator(param: WordValueTypeParam, value: string) {
   const validity = new WordValidity
   switch (param.type) {
      case WordValueType.str:
         if (param.regex && !value.match(param.regex)) {
            validity.status = StatusCode.fail
            validity.msg = '值不匹配正则表达式：' + param.regex
         }
         break
      case WordValueType.bool:
         if (!BOOL_SET.has(value)) {
            validity.status = StatusCode.fail
            validity.msg = '值不为bool类型'
         }
         break
      case WordValueType.enum:
         if (param.optiontmp && !param.optiontmp.find(x => x === value)) {
            validity.status = StatusCode.fail
            validity.msg = '值不在备选选项中'
         }
         break
      case WordValueType.int:
         const i = defaultValidatorInt(param, value)
         validity.status = i.status
         validity.msg = i.msg
         break
      case WordValueType.float:
         const f = defaultValidatorFloat(param, value)
         validity.status = f.status
         validity.msg = f.msg
         break
      case WordValueType.color:
         const c = defaultValidatorColor(param, value)
         validity.status = c.status
         validity.msg = c.msg
         break
      default:
         validity.status = StatusCode.warn
         validity.msg = '值定义缺失'
   }
   return validity
}

const IS_INT = /^(\-)?\d+$/
function defaultValidatorInt(param: WordValueTypeParam, value: string) {
   const validity = new WordValidity
   const tmp = parseInt(value)
   let flag = !isNaN(tmp) && !!IS_INT.exec(value)
   if (!flag) {
      validity.status = StatusCode.fail
      validity.msg = '值不是int类型'
      return validity
   }
   // @ts-ignore
   const min = parseInt(param.min)
   if (!isNaN(min) && tmp < min) {
      validity.status = StatusCode.fail
      validity.msg = '值不能小于：' + min
      return validity
   }
   // @ts-ignore
   const max = parseInt(param.max)
   if (!isNaN(max) && tmp > max) {
      validity.status = StatusCode.fail
      validity.msg = '值不能大于：' + max
   }
   return validity
}

const IS_FLOAT = /^(\-)?\d*(\.\d+)?$/
function defaultValidatorFloat(param: WordValueTypeParam, value: string) {
   const validity = new WordValidity
   const tmpf = parseFloat(value)
   let flagf = !isNaN(tmpf) && !!IS_FLOAT.exec(value)
   if (!flagf) {
      validity.status = StatusCode.fail
      validity.msg = '值不是float类型'
      return validity
   }
   // @ts-ignore
   const minf = parseFloat(param.min)
   if (!isNaN(minf) && tmpf < minf) {
      validity.status = StatusCode.fail
      validity.msg = '值不能小于：' + minf
      return validity
   }
   // @ts-ignore
   const maxf = parseFloat(param.max)
   if (!isNaN(maxf) && tmpf > maxf) {
      validity.status = StatusCode.fail
      validity.msg = '值不能大于：' + maxf
   }
   return validity
}

const IS_COLOR = /^\d+\,\d+\,\d+$/
const COLOR_ESCAPE = /[\s\(\)]+/g
function defaultValidatorColor(param: WordValueTypeParam, value: string) {
   const validity = new WordValidity
   const tmp = value.replaceAll(COLOR_ESCAPE, '')
   if (!tmp.match(IS_COLOR)) {
      validity.status = StatusCode.fail
      validity.msg = '值不是rgb颜色'
      return validity
   }
   const rgb = tmp.split(',').map(x => parseInt(x))
   if (!rgb.every(x => x >= 0 && x <= 255)) {
      validity.status = StatusCode.fail
      validity.msg = 'rgb颜色值应介于0~255之间'
      return validity
   }
   return validity
}


/**
 * 使用hook对word进行校验
 * @throws 'word的hooks不能为空'
 */
export function hookValuesValidator(word: WordRo, values: string[], ctx: HookCtx) {
   const hooks = word.hooks
   if (!hooks) throw Error('word的hooks不能为空')
   const validity = new WordValidity
   if (!hooks.validate) return validity
   return hooks.validate(values, ctx)
}
