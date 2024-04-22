import { useEffect } from '@ra2inier/core'

const fn = useEffect(() => {
   console.log('产生了副作用')
   return 12
}, () => {
   console.log('副作用被清理了')
})

console.log(fn())
console.log(fn())

