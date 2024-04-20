<script lang='ts' setup>
import Options from '@/components/Options.vue';
import { useConfigStore } from '@/stores/config';
import { FlexArea, FlexInput } from '@ra2inier/wc';
import { computed, reactive, ref } from 'vue';
import { useThemeState } from '@/states/theme'
import { useFolder } from '@/hooks/folder';
import ListView from '@/components/ListView.vue';
import { IItem, ListViewState } from '@/components/ListViewState';
import addSvg from '@/asset/icons/add.svg?raw'
import { useThemeChangeAnimation } from './themeTransition';

defineOptions({ name: 'Setting' })
const { config, set } = useConfigStore()
const proxy = new Proxy(config, {
	get(target, p: string) { return target[p] },
	set(target, p: string, newValue) {
		set(p, newValue)
		return true
	},
})

// 主题控制逻辑
const theme = useThemeState()
const themeList = computed(() => Object.keys(theme.map))
const listState: ListViewState = reactive(new ListViewState(themeList.value))
listState.singleSelect = true

// 主题修改逻辑
const { folded, vFolder } = useFolder(undefined, true)
const cursorName = ref(theme.name)
function onThemeSelect(item: IItem, order: number) {
	cursorName.value = item.value
}
async function onThemeDelete(item: IItem, order: number) {
	await theme.setTheme(item.value, undefined)
	listState.select(theme.name)
}
function onTextChange(e: CustomEvent) {
	theme.setTheme(cursorName.value, e?.detail || '')
}

// 主题切换动画
const { onThemeChange,onThemeMouseMove} = useThemeChangeAnimation()

// 新主题添加
const theNew = ref('')
function onAddThemeClick() {
	const nv = theNew.value
	if (!nv) return
	const target = listState.findIndex(x => x.value === nv)
	if (target > -1) {
		listState.select(listState[target].value)
	} else {
		const tmp = listState.add(nv)
		listState.select(tmp.value)
	}
	theme.addTheme(nv)
	theme.name = nv
	cursorName.value = nv
	theNew.value = ''
}


</script>


<template>
	<div :class="$style.setting" class="scroll">
		<h2>通用</h2>
		<li>
			<span>GPU加速：</span>
			<Options :alias="['开启', '关闭']" :values="['yes', 'no']" v-model="proxy.GPU"></Options>
		</li>
		<li>
			<s v-folder>&gt;</s>
			<span @click="folded = !folded">主题：</span>
			<Options :values="themeList" :model-value="theme.name" @update:model-value="onThemeChange"
				@mousemove="onThemeMouseMove"></Options>
		</li>
		<p v-show="!folded" :class="$style.list">
			<ListView :state="listState" @select="onThemeSelect" @delete="onThemeDelete">
				<template #footer>
					<flex-input v-model="theNew" class="normal-input" placeholder="添加新主题" @keydown.enter="onAddThemeClick">
					</flex-input>
					<em v-svgicon="addSvg" class="normal-button" @click="onAddThemeClick"></em>
				</template>
			</ListView>
		</p>
		<p v-if="!folded">
			<flex-area :text="theme.map[cursorName]" @change="onTextChange" class="normal-rpanel"></flex-area>
		</p>
		<h2>对象编辑器</h2>
		<li>
			<span>关闭标签时触发保存：</span>
			<Options :alias="['开启', '关闭', '询问']" :values="['yes', 'no', 'ask']" />
		</li>
		<li>
			<span>每段时间触发保存：</span>
			<Options :alias="['修改后5秒', '每1分钟', '每5分钟', '每10分钟', '不触发']" :values="['1', '2', '3', '4', '5']" />
		</li>
		<footer></footer>
	</div>
</template>

<style scoped lang='scss' module>
$align: align-size(normal);

.setting {
	padding: $align 0;

	>* {
		margin: align-size(tiny) 0;
	}

	li {
		display: flex;
		padding: 0 $align;
		height: 1lh;
	}

	p {
		padding: 0 $align ;
	}

	footer {
		height: max(40%, 400px);
	}

	flex-area {
		display: block;
		width: 100%;
		padding: 0 1ch;
	}

	em {
		display: inline-block;
		height: 0.7lh;
		aspect-ratio: 1;
		margin-left: $align;
	}

	.list {
		width: 400px;
		min-width: fit-content;
		max-width: 80%;
	}

	h2 {
		padding-left: $align;
		margin-top: align-size(large);
	}
}
</style>
