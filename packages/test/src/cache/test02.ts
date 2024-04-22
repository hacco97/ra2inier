import { useMemo } from "@ra2inier/core"

function getString() {
	return String(Math.random())
}

const memorized = useMemo(getString, undefined, 10000)[0]

const ret = [
	memorized(),
	memorized(),
	memorized(),
	memorized(),
	memorized(),
]

console.log(ret)
