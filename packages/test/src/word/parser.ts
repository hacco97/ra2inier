import { parseValueTypeExp } from '@ra2inier/core';

const test01 = 'str(str)*,int(12,22),enum(e1:hello,e2:world,w)*2,color,float(0,1),obj(),bool(cdffsfe,dqefef)'
console.log('test01')
console.log(parseValueTypeExp(test01))
