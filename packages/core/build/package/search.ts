import { Package, ValueSetKey, WordRo } from "@ra2inier/core/boot"

export class GraphWalker {
	graph: Package[][] = []

	constructor(graph: Package[][]) {
		this.graph = graph
	}

	wordNameMap: Record<string, WordRo> = {}

	searchObjectByName(objectName: string, type: ValueSetKey) {
		let target: WordRo
		if (target = this.wordNameMap[objectName]) return target
		const graph = this.graph
		for (let i = 0, len = graph.length; i < len; ++i) {
			const floor = graph[i]
			for (let j = 0, len = floor.length; j < len; ++j) {
				const tmp = floor[j]

			}
		}
	}

	forEach() {

	}
}