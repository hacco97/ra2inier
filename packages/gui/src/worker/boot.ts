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
	
	const types: AllTypeKey[] = ['objects', 'scopes', 'mappers', 'dictionary']

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
		removePackage
	}
}

export const [useProject, resetProject] = useSingleton(createProject, true)