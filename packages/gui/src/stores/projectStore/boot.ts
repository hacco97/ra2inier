import { useLogger } from '@/boot/logger';
import {
	createProjectRo, EMPTY_PROJECTVO, forIn, IniObjectRo, MapperRo, PackageRo,
	PackageVo, parsePackages, Project, ProjectVo, Reference, resolveReferences, ScopeRo, WordRo,
} from '@ra2inier/core';
import { computed, reactive, shallowReactive } from 'vue';

/**
 * 创建一个项目初始化值
 */
export function createProject(projectVo: ProjectVo) {
	/*
	  核心project对象
	 */
	const project = reactive(createProjectRo(projectVo))
	/*
	  主包对象
	 */
	const main = computed(() => project.main || new PackageRo)
	const mainKey = computed(() => project.main?.key || '')
	const loaded = computed(() => !project.isEmpty)
	/*
	  依赖图对象
	*/
	const { graph: depthGraph = [] } = resolveReferences(mainKey.value, project.packages)
	console.log(depthGraph)


	/**
	 * 修改主包中的对象
	 */
	function setValue<V extends ValueSetKey, T extends ValueSetType[V]>(type: V, key: string, value?: T) {
		const tmp = main.value![type][key]
		if (!value) {
			delete main.value![type][key]
		} else {
			main.value![type][key] = value
		}
		return tmp as T
	}

	function setPackage(key: string, pkg?: PackageRo) {
		if (key === mainKey.value) return
		if (pkg) { project.packages[key] = shallowReactive(pkg) }
		else delete project.packages[key]
	}

	function setReference(key: string, refer?: Reference) {
		if (!main.value) return
		if (refer) main.value.references[key] = new Reference(refer)
		else delete main.value.references[key]
	}

	function setReferences(map: Record<string, Reference>) {
		let tmp: Record<string, Reference> = {}
		forIn(map || {}, (key, value) => {
			tmp[key] = new Reference(value)
		})
		main.value.references = tmp
	}

	/**
	 * 修改project的头部数据信息
	 */
	function setProjectInfo(info: Record<string, any>) {
		const p = new Project
		forIn(info, (key, val) => {
			if (key in p) {
				project[key] = val
			}
		})
	}

	/**
	 * 根据当前的main的reference，在当前项目已经加载的包中，将不再需要的包移除，找出还没有加载的包
	 * @returns [toAdd, toDel] - packages to add and removed packages' keys
	 */
	function checkPackage(references?: Record<string, Reference>) {
		// 删去多余的包
		const toDel = []
		if (references) { setReferences(references) }
		else references = main.value.references
		const pkgs = project.packages
		for (const key in pkgs) {
			if (key in references) continue
			setPackage(key, undefined)
			toDel.push(key)
		}

		// 确定未加载的包
		const toAdd: Reference[] = []
		for (const key in references) {
			setReference(key, references[key])
			if (key in pkgs) continue
			toAdd.push(references[key])
		}
		return [toAdd, toDel] as const
	}

	/**
	 * 向当前项目资源集合中添加新的资源集合
	 */
	function mergePackages(pkgs: Record<string, PackageVo>) {
		const parsed = parsePackages(pkgs)
		forIn(parsed, (key, pkg) => {
			setPackage(key, pkg)
			setReference(key, Reference.of(pkg))
		})
	}

	return {
		project,
		main,
		mainKey,
		loaded,
		depthGraph,
		setValue,
		setProjectInfo,
		setPackage,
		setReferences,
		setReference,
		checkPackage,
		mergePackages,
	}
}

export type ProjectBoot = ReturnType<typeof createProject>

/**
 * 资源集合的名字键值
 */
export type ValueSetType = {
	objects: IniObjectRo
	dictionary: WordRo
	mappers: MapperRo
	scopes: ScopeRo
}

/**
 * 资源集合的名字键值
 */
export type ValueSetKey = keyof ValueSetType

export const EMPTY_BOOT = createProject(new EMPTY_PROJECTVO)
const logger = useLogger('no project')
export const EMPTY_METHOD = () => {
	logger.warn('请打开一个项目')
	throw Error('请打开一个项目')
}

/**
 * 使用一个工厂函数创建一个对象，将其中所有的函数替换成空方法 EMPTY_METHOD
 */
export function createEmpty<K extends (...args: any) => any>(factory: K) {
	const EMPTY_DERIVED: Record<string, any> = factory(EMPTY_BOOT)
	for (const key in EMPTY_DERIVED) {
		const tmp = EMPTY_DERIVED[key]
		if (typeof tmp === 'function')
			EMPTY_DERIVED[key] = EMPTY_METHOD
	}
	return <ReturnType<K>>EMPTY_DERIVED
}

