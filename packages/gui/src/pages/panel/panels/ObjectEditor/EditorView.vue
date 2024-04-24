<script setup lang="ts">
import { Ref, computed, inject, ref, shallowReactive } from 'vue';
import ListBox from '@/components/dirty/ListBox.vue';
import MapBox from '@/components/dirty/MapBox.vue';
import { useFocus } from '@/hooks/focus';
import { FlexArea, FlexInput } from '@ra2inier/wc';
import Prompt from '@widget/Prompt/Prompt.vue';
import { PromptState, usePromptHelper } from '@widget/Prompt/promptState';
import { useEditorKeymap } from './editorKeymap';
import { EditorState, usePromptCoord, } from './EditorState';
import { EntryRo } from '@/states/Entry';
import { useCursorCoord, useQueryObject, useWindowResize } from './hooks';
import { useProjectStore } from '@/stores/projectStore';

// 初始化数据
const props = defineProps<{ state: EditorState }>()
const state = props.state
const { entrys, data: object } = state
const promptState = shallowReactive(new PromptState)
const store = useProjectStore()

// 焦点逻辑
const focus = useFocus()
const vFocus = focus.directive
const vAutoFocus = { mounted(el: HTMLElement) { el.focus() } }

// 提示框定位逻辑
const { onColFocus, onRowFocus, translate: promptPosition } = usePromptCoord()
const promptHelper = usePromptHelper(store, promptState)
function onInputFocused(e: Event, order: number, vid: number, entry: EntryRo) {
	// 切换焦点
	focus.setCurrent(order + vid)
	// 切换被选择的词条
	entry.vid = vid
	promptHelper.updateEntry(entry)
	// 隐藏提示框防止闪烁，重定位提示框位置
	promptState.hide()
	onColFocus(e)
	e.currentTarget!.dispatchEvent(new CustomEvent('flex-focus', { bubbles: true }))
}
function onNewInputFocused(e: KeyboardEvent) {
	const order = state.length
	focus.setCurrent(order)
	promptState.hide()
	onColFocus(e)
	e.currentTarget!.dispatchEvent(new CustomEvent('flex-focus', { bubbles: true }))
}

// 提示框显示逻辑
function onPromptSubmit(value: string) {
	focus.focusCurrent()
}
function onPromptBlur() {
	if (!promptState.isFocus) promptState.hide()
}
function onInputCtxMenu(e: Event) {
	promptState.active()
	e.preventDefault()
	e.stopPropagation()
}
useWindowResize(() => promptState.close())

// 键盘监听逻辑
const {
	inputKeymap: vKeymap,
	theNewKeymap: vNkeymap
} = useEditorKeymap({ state, focus, promptState })
function onInputKeydown(e: KeyboardEvent) {
	if (promptState.isShowed) return
	if (e.key.length !== 1) return
	if (e.ctrlKey || e.altKey) return
	(<FlexInput>e.target).change()
	promptState.show()
}
function onInputBlur(e: KeyboardEvent) {
	setTimeout(() => {
		if (!promptState.isFocus) {
			promptState.hide()
		}
	}, 10)
}
function onInputChange(e: CustomEvent, eid: number, vid: number) {
	state.setValueById(eid, e.detail, vid)
}

// 对象查询逻辑
const { onInputKeyup } = useQueryObject(promptState)

// 游标逻辑
const { onRowClick, current } = useCursorCoord()
function onLabelClick(e: MouseEvent, item: EntryRo) {
	if (e.shiftKey) {
		const a = item.order, b = state.entrys[current.value].order
		const max = Math.max(a, b), min = Math.min(a, b)
		for (const entry of entrys) {
			if (entry.order >= min && entry.order <= max)
				entry.selected = true
		}
	} else {
		item.selected = !item.selected
	}
	current.value = item.id
}
function onLabelAuxClick() {
	for (const entry of entrys) {
		entry.selected = false
	}
}


// 注释逻辑
const isDetailFolded = ref(false)

// 子面板逻辑
function onSubFoldClick(entry: EntryRo) {
	entry.isSubFolded = !entry.isSubFolded
}

// 分栏
const columCount = computed(() => ({ columns: state.columnCount }))

const detailFolded = inject<Ref<boolean>>('detail-folded')!
</script>

<template>
	<!-- 中部内容 -->
	<main :class="$style.main" id="object-editor">
		<section tabindex="-1">
			<ol>
				<!-- 提示框 -->
				<nav v-show="promptState.isShowed">
					<div :style="promptPosition" class="normal-box">
						<Prompt :disabled="false" :state="promptState" @blur="onPromptBlur" @submit="onPromptSubmit">
						</Prompt>
					</div>
				</nav>

				<!-- 对象info -->
				<h2 v-show="!detailFolded">
					<p>附属对象：</p>
					<ListBox :list="object.inline" :disabled="false"></ListBox>
					<p>局部变量：</p>
					<MapBox :map="object.envVariable" :disabled="false"></MapBox>
					<p>备注：</p>
					<flex-area v-show="!isDetailFolded" class="normal-rpanel" v-model.lazy="state.detail"
						placeholder="添加对象备注"></flex-area>
				</h2>
				<hr style="height: 10px;">
				<ul :style="columCount">
					<!-- 词条编辑框 -->
					<li v-for="(entry, eid) in entrys" :key="entry.id" class="oe-line" @click="onRowClick(eid)"
						:style="{ order: entry.order }">
						<p @flex-focus="onRowFocus">
							<i @click="onSubFoldClick(entry)" class="folder" :folded="entry.isSubFolded">&gt;</i>
							<span :selected="entry.selected" @auxclick="onLabelAuxClick" @click="onLabelClick($event, entry)"
								:cursor="current === eid">
								{{ entry.wordName }}
							</span>
							<em>=</em>
							<flex-input class="oe-input" v-for="(value, vid) in entry.values" :key="vid" :value="value"
								@change="onInputChange($event, eid, vid)" v-focus="entry.order + vid" v-keymap="entry"
								@blur="onInputBlur" @focus="onInputFocused($event, entry.order, vid, entry)"
								@keydown="onInputKeydown" @keyup="onInputKeyup" @contextmenu="onInputCtxMenu" />
						</p>
						<article v-show="entry.validitys.length > 0">
							<h3 v-for="validity in entry.validitys">{{ validity.msg }}</h3>
						</article>
						<flex-area v-show="!entry.isSubFolded" v-model.lazy="entry.comment" placeholder="添加备注"></flex-area>
					</li>

					<!-- 新词条输入框 -->
					<li @flex-focus="onRowFocus" class="oe-line">
						<p>
							<em>&lt;</em>
							<flex-input :class="$style['the-new']" class="oe-input" v-model.lazy="state.theNew"
								@focus="onNewInputFocused" v-focus="state.length" v-auto-focus v-nkeymap />
						</p>
					</li>
				</ul>
			</ol>
		</section>
	</main>
</template>

<style scoped lang='scss' module>
$height: align-size(larger);
$align: align-size(normal);

.main {
	position: relative;
	padding: $align 0;
	z-index: var(--z-index-main);
	min-height: 0;
	line-height: var(--line-height);

	section {
		height: 100%;
	}

	ol {
		// 不可更改，ol是提示框的定位元素，提示框的工作依赖于ol的相对定位属性
		position: relative;
		z-index: auto;
	}

	h2 {
		padding: 0 $align;
	}

	flex-area {
		display: block;
		width: 100%;
		padding: 0 $align;
	}

	ul {
		columns: 1;
		column-fill: balance;
	}

	nav {
		width: 0;
		height: 0;
		overflow: visible;

		>div {
			position: relative;
			z-index: var(--z-index-nav);
			width: fit-content;
		}
	}

	@import './editor-view.scss';
}

.the-new {
	min-width: 150px;
}
</style>
