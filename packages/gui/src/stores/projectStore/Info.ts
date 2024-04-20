import { PackageRo, Project, ProjectRo, Reference } from "@ra2inier/core"
import { IItem } from '@/components/ListViewState';
import { fromRaw } from '@ra2inier/core';

export class ReferItem implements IItem, Reference {
	/**
	 * 包名->Reference
	 */
	name: string = ''
	/**
	 * 包的键值->IItem、Reference
	 */
	key: string = ''
	/**
	 * 包的远程地址->Reference
	 */
	url = ''
	/**
	 * 依赖的版本->Reference
	 */
	version = 0
	/**
	 * 包的本地路径-> ??
	 */
	path: string = ''
	/**
	 * 列表项目的显示值->IItem
	 */
	value: string = ''
	/**
	 * 列表项是否被选中->IItem
	 */
	selected: boolean = false
	/**
	 * 列表项中的细节->IItem
	 * 显示当前项目的依赖项
	 * 依赖项可以分为两种形态，已经加载的和未加载的
	 * 未加载的包为虚悬依赖，实际上当前内存中没有该包的数据，不能够参与当前项目的构建
	 */
	detail: string = ''
}

export class ProjectInfo implements Project {
	/**
	 * 当前项目的名称
	 */
	name = ''
	/**
	 * 项目作者
	 */
	author = ''
	/**
	 * 项目的目标环境
	 */
	target = ''
	/**
	 * 项目的引用列表
	 */
	references: ReferItem[] = []

	buildConfig: Record<string, string> = {}
	referPathMap: Record<string, string> = {}

	constructor(project?: ProjectRo) {
		if (!project) return
		const main = project.main || new PackageRo
		this.name = project.name || '?'
		this.author = main.author || '?'
		this.target = main.target
		this.references = []
		for (let r of Object.values(main.references)) {
			const tmp = createReferItem(r)
			tmp.detail = ''
			this.references.push(tmp)
		}
	}
}

/**
 * 将一个Reference对象转化为ReferItem对象
 */
export function createReferItem(x: Partial<Reference>) {
	const tmp = fromRaw(x, ReferItem)
	tmp.value = x.name || ''
	return tmp
}

