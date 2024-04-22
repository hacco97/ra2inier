import { useMemo } from '@ra2inier/core';

function getRandom() {
   let a = 0
   for (let i = 0; i < 100; ++i) {
      a++
   }
   return a + ':' + Math.floor(Math.random() * 100)
}

function getName(key: string) {
   return 'name:' + key + ':' + Math.floor(Math.random() * 100)
}

const [getMemoName, _, expire] = useMemo(getName, x => x.split('-')[1])

const u1 = getMemoName('u-zs')
const u2 = getMemoName('u-zs')
expire('u-zs')
const u3 = getMemoName('u-zs')

console.log(u1, u2, u3)
