import { Item, ListViewState } from "@/components/ListViewState"
import { ReferItem, useProjectStore } from "@/stores/projectStore"
import { useGlobalPackages } from "@/stores/staticStore"
import { Package, Reference, ReferenceWithPath, UniqueObject, forIn, fromRaw, overrideArray } from "@ra2inier/core"
import { useDebounceFn } from "@vueuse/core"
import { reactive, watch } from "vue"

export function useReferViewState(referList: ReferItem[]) {
	const references = reactive(referList.slice(0))
	const store = useProjectStore()

	function getDetail(key: string) {
		const loaded = store.packages
		return (key! in loaded) ? '已加载' : '未加载'
	}

	function flushDetail() {
		for (const r of references) {
			r.detail = getDetail(r.key)
		}
	}
	watch(store.packages, useDebounceFn(flushDetail, 200))

	function addRefer(newOne: Partial<ReferItem>) {
		const tmp = fromRaw(newOne, ReferItem)
		for (const r of references) {
			if (r.key === newOne.key)
				return Object.assign(r, tmp), flushDetail()
		}
		references.push(tmp)
		flushDetail()
		return newOne
	}

	function deleteRefer(key: string) {
		const id = references.findIndex(x => x.key === key)
		if (id >= 0) references.splice(id, 1)
		flushDetail()
	}

	function getReferMap() {
		const tmp: Record<string, ReferenceWithPath> = {}
		references.forEach((x) => {
			if (x.key) tmp[x.key] = {
				...fromRaw(x, Reference),
				path: x.path,
				name: x.name
			}
		})
		return tmp
	}

	function update(referList: ReferItem[]) {
		references.splice(0, references.length, ...referList)
	}

	return {
		references,
		flushDetail,
		addRefer,
		deleteRefer,
		getReferMap,
		update
	}
}

export type ReferViewState = ReturnType<typeof useReferViewState>

export function useLocalList(referList: ReferItem[]) {
	/**
		 * 加载全局包，用于显示当前的机器上，在两处位置处的包，可以快速地进行选择依赖
		 */
	const globalPackages = useGlobalPackages()
	const localList = reactive(new ListViewState([]))
	watch(globalPackages, () => {
		const tmp: ReferItem[] = []
		forIn(globalPackages, (key, pkg) => {
			const newOne = pkg2ReferItem(pkg)
			const target = referList.find(x => newOne.key === x.key)
			newOne.selected = !!target
			tmp.push(newOne)
		})
		overrideArray(tmp.map(x => new Item(x)), localList)
	}, { immediate: true })

	return localList
}

/**
 * 将一个Package对象转化为ReferItem
 */
export function pkg2ReferItem(pkg: Package) {
	const tmp = fromRaw(pkg, ReferItem)
	tmp.selected = false
	tmp.value = UniqueObject.getFullname(pkg)
	return tmp
}
