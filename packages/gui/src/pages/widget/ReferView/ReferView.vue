<script lang='ts' setup>
import openSvg from '@/asset/icons/openDir.svg?raw';
import zipSvg from '@/asset/icons/zip.svg?raw';
import githubSvg from '@/asset/icons/github.svg?raw';
import copySvg from '@/asset/icons/copy.svg?raw';
import submitSvg from '@/asset/icons/submit.svg?raw';
import ListView from '@/components/ListView.vue';
import { FlexInput } from '@ra2inier/wc';
import { useFolder } from '@/hooks/folder';
import { downloadPackage, openDirectory, readPackageDir } from '@/boot/apis';
import { reactive, ref, watch } from 'vue';
import { Package, Reference, fromRaw, isEmptyObject } from '@ra2inier/core';
import { IItem, ListViewState } from '@/components/ListViewState';
import { ReferViewState, pkg2ReferItem, useLocalList } from './ReferViewState'
import Popup from './Popup.vue'
import { useConfigStore } from '@/stores/config';

interface Prop {
	state: ReferViewState,
	folded?: boolean,
	showDetail?: boolean
}
const props = defineProps<Prop>()
const { config } = useConfigStore()

const { references, deleteRefer, addRefer } = props.state
// UI当前的已经引用的包展示
const referListState: ListViewState = reactive(new ListViewState(references))
referListState.checkBox = false
referListState.showDetail = (props.showDetail === undefined || props.showDetail) ? true : false
watch(references, () => referListState.update(references))
function onReferDelete(item: IItem) {
	deleteRefer(item.key)
	const target = localListState.find(x => x.key === item.key)
	target && (target.selected = false)
}

// 从内置导入逻辑
const localListState = reactive(useLocalList(references))
localListState.deleteButton = false
function onBuildinSelect(item: IItem) {
	if (item.selected) { addRefer(item) }
	else { deleteRefer(item.key) }
}

// 本地导入引用逻辑
const newPath = ref('')
const loadPath = async (paths: string[]) => {
	const loaded = await readPackageDir(paths)
	for (const pkg of loaded) {
		const tmp = fromRaw(pkg, Package)
		addRefer({
			key: tmp.key,
			value: tmp.fullname,
			path: pkg.path,
			version: pkg.version,
			name: pkg.name
		})
	}
	return !isEmptyObject(loaded)
}
async function onOpenClick() {
	const dirs = <string[]>await openDirectory(config.DEFAULT_PROJECT_DIR)
	if (!dirs || !dirs[0]) return
	loadPath(dirs)
}
function onLocalSubmitClick() {
	if (!newPath.value) return
	loadPath([newPath.value])
}
function onZipClick() {
	theLogger.warn('功能尚未实现', '从zip导入包')
}

// 从远程到日引用逻辑
const newUrl = ref('')
async function onCopyClick() {
	const text = await navigator.clipboard.readText()
	newUrl.value = text.replaceAll('\n', '')
	loadUrl(newUrl.value)
}

function onRemoteSubmitClick() {
	if (!newUrl.value) return
	loadUrl(newUrl.value)
}


const loadUrl = async (url: string) => {
	if (!url) return
	const refer = new Reference({
		name: getName(url),
		url,
	})
	const downloaded = await downloadPackage([refer])
	console.log(downloaded)

	for (const refer of downloaded) {
		addRefer(pkg2ReferItem(refer))
	}
}

const getName = (url: string) => {
	const target = url.lastIndexOf('/')
	if (target < 0) return url.replaceAll('/', '_')
	return url.substring(target + 1)
}

const { folded: isLocalFolded, vFolder } = useFolder(undefined, props.folded)
</script>


<template>
	<ul :class="$style.refer">
		<ListView :state="referListState" :class="$style.current" :check-box="false" @delete="onReferDelete">
			<template #default>
				<h2>
					<b v-folder>&gt;</b>
					<span @click="isLocalFolded = !isLocalFolded">引用：</span>
				</h2>
			</template>
			<template #popup="item">
				<Popup :item="<any>item"></Popup>
			</template>
		</ListView>
		<main class="normal-rpanel list-view" v-show="!isLocalFolded">
			<ListView v-if="localListState.length" :state="localListState" :delete-button="false"
				@select="onBuildinSelect">
				<h3><span>从内置导入：</span></h3>
				<template #popup="item">
					<Popup :item="<any>item"></Popup>
				</template>
			</ListView>
			<div v-else>没有找到内置包</div>
			<h3>
				<span>从本地导入：</span>
				<flex-input v-model="newPath" class="fore-input" placeholder="本地路径"></flex-input>
				<s class="normal-button" v-svgicon="submitSvg" padding="15%" @click="onLocalSubmitClick"></s>
				<s class="normal-button" v-svgicon="openSvg" padding="15%" title="从文件夹导入" @click="onOpenClick"></s>
				<s class="normal-button" v-svgicon="zipSvg" padding="15%" title="从zip文件导入" @click="onZipClick"></s>
			</h3>
			<h3>
				<span>从远程导入：</span>
				<flex-input v-model="newUrl" class="fore-input" placeholder="远程连接"></flex-input>
				<s class="normal-button" v-svgicon="submitSvg" padding="15%" @click="onRemoteSubmitClick"></s>
				<s v-svgicon="copySvg" class="normal-button" padding="15%" title="从剪贴板导入链接" @click="onCopyClick"></s>
				<a href="https://github.com/" class="normal-button" title="前往GitHub"><span v-svgicon="githubSvg"></span></a>
			</h3>
		</main>
	</ul>
</template>

<style module scoped lang='scss'>
$align: align-size(normal);

.refer {
	ul {
		height: fit-content;
		width: fit-content;
		padding: 0 $align;
	}

	p {
		height: 1lh;
	}

	h2 {
		display: flex;
		align-items: center;
	}

	s,
	a,
	lazy-button {
		flex: 0 0 auto;
		height: 1lh;
		aspect-ratio: 1;
	}

	main {
		padding: 0 $align;


		h3 {
			display: flex;
			height: 1lh;
		}

		h3>* {
			margin-right: $align;
		}
	}


	flex-input {
		display: inline-block;
		height: 1lh;
		min-width: 4em;
	}
}

.current {
	line-height: line-height(small);
}
</style>
