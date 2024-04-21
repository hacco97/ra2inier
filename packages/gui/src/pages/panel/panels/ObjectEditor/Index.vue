<script lang='ts' setup>
import { provide, ref, shallowReactive, watch } from 'vue';
import checkSvg from '@/asset/icons/check.svg?raw';
import columnSvg from '@/asset/icons/column.svg?raw';
import rightSvg from '@/asset/icons/right.svg?raw';
import delSvg from '@/asset/icons/delete.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import { PanelParam } from '@/states/panelList';
import { FlexInput, LazyButton } from '@ra2inier/wc';
import HeaderLayout from '../HeaderLayout.vue';
import EditorView from './EditorView.vue';
import { EditorState } from './EditorState';
import { useProjectStore } from '@/stores/projectStore';
import { useQueryWord } from './hooks'
import { useFolder } from '@/hooks/folder';

defineOptions({ name: 'ObjectEditor' })
const store = useProjectStore()


const props = defineProps<{ param: PanelParam }>()
let param: PanelParam = props.param
const state = shallowReactive(new EditorState(param.init))
const changed = ref(false)

watch(() => props.param, () => {
	changed.value = false
	param = props.param
	param.on('before-closed', () => {
		if (!changed.value) return
		param.submit(state.value)
	})
}, { immediate: true })

function onSaveClick() {
	if (!changed.value) return
	param.save(state.value)
	changed.value = false
}

function onNameChange() { param.label = state.data.name }
function ondeleteClick() {
	changed.value = true
	state.removeSelected()
}
function onColumnClick() { state.columnCount = (state.columnCount + 1) % 5 }

const { } = useQueryWord()
function onCheckClick() {

}
const labelHelper = ref<HTMLElement>()
const { folded: detailFolded, vFolder } = useFolder(undefined, true)
provide('detail-folded', detailFolded)
</script>


<template>
	<HeaderLayout @keydown="changed = true">
		<template #header>
			<div :class="$style.editor" tabindex="-1">
				<!-- 头部 -->
				<h1 class="scrollx" v-scrollx>
					<ul>
						<h2>
							<em>./</em><span>{{ store.projectName }}</span><em>/</em>
							<i></i><flex-input v-model.lazy.trim="state.data.group" placeholder="GROUP_NAME" /><i></i>
							<em>/</em>
							<i></i>
							<flex-input v-model.lazy.trim="state.data.name" @change="onNameChange" placeholder="OBJECT" />
							<em>.</em>
							<flex-input v-model.lazy.trim="state.data.scope" placeholder="NullTypes" /><i></i>
							<em>/</em><i @click="labelHelper?.focus()"></i>
							<flex-input ref="labelHelper" v-model.lazy.trim="state.currentChild" placeholder="root" />
						</h2>
						<label @click="labelHelper?.focus()"></label>
						<label></label>
						<aside :class="$style.buttons">
							<lazy-button @click="onSaveClick">
								<s title="保存(Ctrl + S)" v-svgicon="saveSvg" class="fore-button"></s>
							</lazy-button>
							<lazy-button @click="onCheckClick">
								<s title="检查(Ctrl + A)" v-svgicon="checkSvg" class="fore-button"></s>
							</lazy-button>
							<s title="详情" v-folder padding="15%" v-svgicon="rightSvg" class="fore-button"></s>
							<s title="分栏" padding="15%" v-svgicon="columnSvg" class="fore-button" :column="state.columnCount"
								:class="$style.column" @click="onColumnClick"></s>
							<em></em>
							<lazy-button @click="ondeleteClick">
								<s title="删除(Delete)" v-svgicon="delSvg" class="fore-button"></s>
							</lazy-button>
						</aside>
					</ul>
				</h1>
			</div>
		</template>

		<template #default>
			<!-- 编辑视图 -->
			<EditorView :state="state" />
		</template>
	</HeaderLayout>
</template>

<style scoped src="./editor.scss" module></style>
