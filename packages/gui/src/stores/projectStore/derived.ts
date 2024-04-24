import { computed } from "vue";
import { EMPTY_BOOT, ProjectBoot } from "./boot";
import { IniObjectRo, MapperRo, PackageRo, ScopeRo, ValueSetKey, ValueSetType, WordRo, forIn } from "@ra2inier/core";

export const EMPTY_WORDRO = new WordRo

export function createDerived(boot: ProjectBoot) {
	const { project, mainKey, main } = boot
	// @ts-ignore
	const get = <T>(str: string) => <Record<string, T>>(main.value[str] || {})
	const mainObjects = computed(() => get<IniObjectRo>('objects'))
	const mainDictionary = computed(() => get<WordRo>('dictionary'))
	const mainMappers = computed(() => get<MapperRo>('mappers'))
	const mainScopes = computed(() => get<ScopeRo>('objects'))
	const projectName = computed(() => project.main?.name || 'ra2 inier')
	const packages = computed(() => project.packages || {})
	const referPackages = computed(() => {
		const refers = { ...project.packages }
		delete refers[mainKey.value]
		return refers
	})
	const packageNames = computed(() => {
		const tmp: Record<string, string> = {}
		forIn(packages.value, (key, pkg) => {
			tmp[key] = pkg.name
		})
		return tmp
	})
	const objects = computed(() => mergeKey(project.packages, 'objects'))
	const scopes = computed(() => mergeKey(project.packages, 'scopes'))
	const mappers = computed(() => mergeKey(project.packages, 'mappers'))
	const dictionary = computed(() => mergeKey(project.packages, 'dictionary'))
	const allOfPackages = {
		get objects() { return objects.value },
		get scopes() { return scopes.value },
		get mappers() { return mappers.value },
		get dictionary() { return dictionary.value },
	}

	/**
	 * 对象查询逻辑，从当前所有包中的资源集合获得所需对象
	 */
	function queryObject<T extends ValueSetKey>(type: T,
		filter: (v: ValueSetType[T]) => number, limit = 20) {
		const targetSet = allOfPackages[type]
		const ret: [number, any][] = []
		forIn(<Record<string, any>>targetSet, (key, val) => {
			const priority = filter(val)
			if (priority > 0) ret.push([priority, val])
		})
		ret.sort((a, b) => a[0] - b[0])
		const temp = []
		for (let i = 0; i < limit && i < ret.length; ++i) { temp.push(ret[i][1]) }
		return <ValueSetType[T][]>(temp.reverse())
	}

	// TODO: 后期添加缓存逻辑
	const NULL_WORD = new WordRo
	NULL_WORD.isNull = true
	NULL_WORD.name = ''
	function queryWord(wordName: string) {
		for (const key in allOfPackages.dictionary) {
			const word = allOfPackages.dictionary[key]
			if (word.name === wordName) return word
		}
		return NULL_WORD
	}

	// TODO: 后期添加缓存逻辑
	async function queryWordAsync(wordName: string) {
		await undefined
		for (const key in allOfPackages.dictionary) {
			const word = allOfPackages.dictionary[key]
			if (word.name === wordName) return word
		}
		return NULL_WORD
	}


	return {
		/**
		 * 项目的名字
		 */
		projectName,
		/**
		 * 主包的所有资源
		 */
		mainObjects,
		mainDictionary,
		mainMappers,
		mainScopes,
		/**
		 * 全部包的快捷链接
		 */
		packages,
		/**
		 * 所有引用包的快捷链接
		 */
		referPackages,
		/**
		 * 根据包的键值获取包名
		 */
		packageNames,
		/**
		 * 返回项目全部包的可读集合
		 */
		allOfPackages,
		objects,
		scopes,
		mappers,
		dictionary,
		/**
		 * 在项目的全部可读集合中查找对象
		 */
		queryObject,
		queryWord,
		queryWordAsync
	}
}

export const EMPTY_DERIVED = createDerived(EMPTY_BOOT)

function mergeKey<T extends ValueSetKey>(packages: Record<string, PackageRo>, readKey: T) {
	const tmp: Record<string, any> = {}
	forIn(packages, (key, pkg) => {
		forIn(pkg[<keyof PackageRo>readKey], (key, obj) => {
			tmp[key] = obj
		})
	})
	return <Readonly<Record<string, ValueSetType[T]>>>tmp
}