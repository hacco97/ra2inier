import { Package, Reference, resolveReferences } from '@ra2inier/core';

const packages: Record<string, Package> = {}

for (let index = 1; index <= 7; index++) {
   const p = new Package
   p.name = 'p' + index
   Object.defineProperty(p, 'key', { value: p.name })
   packages[p.key] = p
}

function setChildren(name: string, children: string[]) {
   for (const key of children) {
      packages[name].references[key] = new Reference(packages[key])
   }
}

setChildren('p1', ['p2', 'p3'])
setChildren('p2', ['p5'])
setChildren('p3', ['p7'])
setChildren('p4', ['p6', 'p2'])
setChildren('p6', ['p7'])
setChildren('p5', ['p4'])

console.log(packages)


const root = resolveReferences('p1', packages)

console.log(root)
