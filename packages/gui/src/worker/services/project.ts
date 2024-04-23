import {
	forIn, IniObjectRo, mergeMappers, mergeObjects,
	mergeScopes, mergeWords, ProjectVo, useEffect,
} from '@ra2inier/core';

import { useMasterAPI, useBackendAPI } from '../apis';
import { useProject, resetProject } from '../boot';
import { doBuild } from '../lib';
import { useObjectHandlers } from './object';


/**
 * 初始化项目处理相关的逻辑
 */
function createProjectHandlers() {
	const { on } = useMasterAPI()
	const { exec } = useBackendAPI()

	const { objects, mappers, dictionary, removePackage } = useProject()

	// 项目初始化
	on('project/init', (project: ProjectVo) => {
		resetProject()
		const { objects, scopes, dictionary, mappers } = useProject()
		forIn(project.packages, (pkgKey, packageVo) => {
			mergeObjects(packageVo.objects, pkgKey, objects)
			mergeScopes(packageVo.scopes, pkgKey, scopes)
			mergeWords(packageVo.dictionary, pkgKey, dictionary)
			mergeMappers(packageVo.mappers, pkgKey, mappers)
		})
		useObjectHandlers()
		useProjectHandlers()
		console.log(useProject())
		
		return true
	})

	// 项目构建入口
	on('project/build', (buildList: string[]) => {
		const objectsList: IniObjectRo[] = []
		for (const key of buildList) {
			const object = objects[key]
			if (object) objectsList.push(object)
		}

		const outputs = doBuild(objectsList, mappers, dictionary)

		forIn(outputs, (path, data) => {
			exec('project/output', {
				outputPath: path,
				data
			})
		})
	})

	on('package/remove', (pkgs: string[]) => {
		for (const key of pkgs) {
			removePackage(key)
		}
	})

	return [0, () => { }] as [0, any]
}

export const useProjectHandlers = useEffect(createProjectHandlers)