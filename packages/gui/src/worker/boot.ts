import {
	createAll, IniObjectRo, MapperRo, PackageRo,
	ScopeRo, WordRo, AllType, AllTypeKey, useSingleton
} from '@ra2inier/core';

/**
 * 创建worker的数据储存集合
 */
function createProject() {
	const all = createAll()
	const {
		objects: objects_,
		scopes: scopes_,
		mappers: mappers_,
		dictionary: dictionary_,
		main: main_,
	} = all

	const {
		objects,
		scopes,
		mappers,
		dictionary,
		main
	} = {
		objects: <Readonly<Record<string, IniObjectRo>>>objects_,
		scopes: <Readonly<Record<string, ScopeRo>>>scopes_,
		mappers: <Readonly<Record<string, MapperRo>>>mappers_,
		dictionary: <Readonly<Record<string, WordRo>>>dictionary_,
		main: <Readonly<Record<string, PackageRo>>>main_,
	}

	function setValue<T extends AllTypeKey>(type: T, key: string, data: AllType[T]) {
		all[type][key] = data
	}

	function setObject(key: string, obejct: IniObjectRo) {
		objects_[key] = obejct
	}

	function setWord(key: string, word: WordRo) {
		dictionary_[key] = word
	}

	function setScope(key: string, scope: ScopeRo) {
		scopes_[key] = scope
	}

	function setMapper(key: string, mapper: MapperRo) {
		mappers_[key] = mapper
	}

	const types: AllTypeKey[] = ['objects', 'scopes', 'mappers', 'dictionary']

	function clearAll() {
		for (const type of types)
			for (const key in all[type]) delete all[type][key]
	}

	function removePackage(pkgKey: string) {
		for (const type of types)
			for (const key in all[type])
				if (all[type][key].package === pkgKey)
					delete all[type][key]
	}

	return {
		all: <Readonly<AllType>>all,
		objects,
		scopes,
		mappers,
		dictionary,
		main,

		setValue,
		setObject,
		setMapper,
		setScope,
		setWord,

		removePackage
	}
}

export const [useProject, resetProject] = useSingleton(createProject, true)