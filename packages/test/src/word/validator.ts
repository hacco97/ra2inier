import {
  createParam, defaultValuesValidator, WordRo, WordValueType,
} from '@ra2inier/core';

/**
 * 测试str类型
 */
const test01 = new WordRo('test01')
const test01_p = createParam()
test01.valueParam = [test01_p]
const test01s = ['d\\d+', 'e\\s2', 'd12d']
for (const test of test01s) {
   test01_p.regex = test
   console.log(test, defaultValuesValidator(test01, ['d123']))
   console.log(test, defaultValuesValidator(test01, ['e 21']))
}


/**
 * 测试bool类型
 */
const test02 = new WordRo('test02')
const test02_p = createParam()
test02_p.type = WordValueType.bool
test02.valueParam = [test02_p]
const test02s = ['yes', 'no', '1', 'fas']
for (const test of test02s) {
   console.log(test, defaultValuesValidator(test02, [test]))
}

/**
 * 测试int类型
 */
const test03 = new WordRo('test03')
const test03_p = createParam()
test03_p.type = WordValueType.int
test03_p.max = 100
test03_p.min = 0
test03.valueParam = [test03_p]
const test03s = ['123', '12.3', '-1', '-0', '-.2', '.0', '1']
for (const test of test03s) {
   console.log(test, defaultValuesValidator(test03, [test]))
}


/**
 * 测试float类型
 */
const test04 = new WordRo('test04')
const test04_p = createParam()
test04_p.type = WordValueType.float
test04_p.max = 100
test04_p.min = 0
test04.valueParam = [test04_p]
const test04s = ['123', '12.3', '-1', '-0', '-.2', '3.', '1.0']
for (const test of test04s) {
   console.log(test, defaultValuesValidator(test04, [test]))
}

/**
 * 测试enum类型
 */
const test05 = new WordRo('test05')
const test05_p = createParam()
test05_p.type = WordValueType.enum
test05_p.optiontmp = ['t1', 't2', 't3']
test05.valueParam = [test05_p]
const test05s = ['t1', 't2', 't4']
for (const test of test05s) {
   console.log(test, defaultValuesValidator(test05, [test]))
}


/**
 * 测试color类型
 */
const test06 = new WordRo('test06')
const test06_p = createParam()
test06_p.type = WordValueType.color
test06.valueParam = [test06_p]
const test06s = ['23, 23, 23', '2333, 3 , 3', '(0,-2,0)', '(34,3,4)', '34,3,4,3', '32.3,3,2']
for (const test of test06s) {
   console.log(test, defaultValuesValidator(test06, [test]))
}
