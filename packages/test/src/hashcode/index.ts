
const d1 = Date.now(), d2 = d1 + 1

function hashCode(a: number, b: number) {
   a = (a << 5) + 114514
   b = (b << 4) * 114.514
   let hash = Math.abs(a + b)
   while (hash > 999_999) hash /= 9.6
   while (hash < 100_000) hash *= 9.6
   return Math.floor(hash)
}

for (let i = 0; i < 10; ++i) {
   console.log(hashCode(d1 * i, d2 * i + 1))
}
