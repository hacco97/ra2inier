import { ProjectInfo } from '@/stores/projectStore';
import { ProjectRo, UniqueObject } from "@ra2inier/core"

export function createProjectInfo(project: ProjectRo) {
	const info = new ProjectInfo(project)
	for (const referItem of info.references) {
		if (referItem.key in project.packages) {
			referItem.path = project.packages[referItem.key].path
			const pkg = project.packages[referItem.key]
			referItem.value = UniqueObject.getFullname(pkg)
			referItem.detail = '已加载'
		} else {
			referItem.detail = '未加载'
		}
	}
	return info
}
