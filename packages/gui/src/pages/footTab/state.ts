import { FootTab, useFoottabState } from "@/states/footTabList"
import { ref } from "vue"


export function useFootTabDrag() {
	const foottab = useFoottabState()
	const draging = ref(foottab.footTabList[0])
	//选项卡可拖动的逻辑
	const onTabDragStart = function (e: DragEvent, tab: FootTab) {
		draging.value = tab
		e.dataTransfer?.setData('foot_tab', '3')
		e.dataTransfer!.effectAllowed = 'move'
		e.dataTransfer!.dropEffect = 'move'
	}

	const onTabDrop = function (e: DragEvent, tab: FootTab) {
		const { footTabList } = foottab

		// TODO: 有副作用，等待更改
		if (!e.dataTransfer?.getData('foot_tab')) return
		if (draging.value?.id === tab.id) return
		let d = draging.value.order
		let order = tab.order
		if (d === order) return
		else if (d > order) {
			for (let i of footTabList) {
				if (i.order < d && i.order >= order) {
					// i.order++
				} else if (i.order === d) {
					// i.order = order
				}
			}
		}
		else {
			for (let i of footTabList) {
				if (i.order > d && i.order <= order) {
					// i.order--
				} else if (i.order === d) {
					// i.order = order
				}
			}
		}
	}

	return {
		onTabDragStart,
		onTabDrop
	}
}