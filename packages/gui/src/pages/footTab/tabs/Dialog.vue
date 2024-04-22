<script lang='ts' setup>
import { inject, Ref } from 'vue';
import { Dialog, DialogType, useDialogState } from '@/states/dialog';
import { FootTabType, useFoottabState } from '@/states/footTabList';
import submitSvg from '@/asset/icons/submit.svg?raw'
import canselSvg from '@/asset/icons/close.svg?raw'
import clearSvg from '@/asset/icons/clear.svg?raw';
import askSvg from '@/asset/icons/ask.svg?raw'

const foottab = useFoottabState()
const dialogs = useDialogState()
// foottab的自定义按钮逻辑
const mounted = <Ref<boolean>>inject('foottab-mounted')

function onFileChange(e: Event, dialog: Dialog) {
	const input = e.target as HTMLInputElement
	dialog.data = input.files ? input.files[0].path : ''
}

const iconList: Record<number, string> = {
	0: canselSvg,
	1: submitSvg,
	[-1]: askSvg
}
function getIcon(num: number) {
	return iconList[num] ?? iconList[-1]
}

</script>


<template>
	<div :class="$style.dialog" class="scroll">
		<ul class="list-view">
			<li v-for="dialog in dialogs.list">
				<!-- 对话头部 -->
				<p class="vertical-center">
					<em>[{{ dialog.time }}]</em>
					<i style="width: 1ch;"></i>
					<u :class="$style.status" v-svgicon="getIcon(dialog.finished)" padding="0" :key="dialog.finished"></u>
					<span>{{ dialog.question }}</span>
				</p>
				<i style="display: inline-block;min-width: 1em;"></i>
				<!-- 选项 -->
				<template v-if="dialog.type === DialogType.askIf && dialog.finished < 0">
					<p>
						<u v-svgicon="submitSvg" class="fore-button" @click="dialog.finish(true)"></u>
						<span v-show="dialog.count > 0">({{ dialog.count }}s)</span>
						<i style="width: 1ch;"></i>
						<u v-svgicon="canselSvg" class="fore-button" @click="dialog.finish(false)"></u>
					</p>
				</template>
				<template v-else-if="dialog.type === DialogType.askStr && dialog.finished < 0">
					<p>
						<input type="text" v-model="dialog.data" />
						<u v-svgicon="submitSvg" class="fore-button" @click="dialog.finish(dialog.data)"></u>
					</p>
				</template>
				<template v-else-if="dialog.type === DialogType.askFile && dialog.finished < 0">
					<p>
						<input type="file" @change="onFileChange($event, dialog)" />
						<u v-svgicon="submitSvg" class="fore-button" @click="dialog.finish(dialog.data)"></u>
					</p>
				</template>
			</li>
		</ul>
	</div>
	<Teleport v-if="mounted" to="#foottab-tools" :disabled="foottab.selected.type !== FootTabType.Dialog">
		<p v-svgicon="submitSvg" class="fore-button" title="确认"></p>
		<p v-svgicon="canselSvg" class="fore-button" title="取消"></p>
		<i style="width: 1em;"></i>
		<p v-svgicon="clearSvg" class="fore-button" title="清除"></p>
	</Teleport>
</template>

<style scoped lang="scss" module>
$align: align-size(normal);

.dialog {
	height: 100%;
	padding: $align 0;

	li {
		display: flex;
		padding: 0 $align;
		height: 1lh;
	}

	p {
		display: flex;
		align-items: center;
	}

	em,
	span {
		@include font-size(small);
	}
}

.status {
	display: inline-block;
	height: 1.5em;
	aspect-ratio: 1;
	vertical-align: center;
}
</style>

<style scoped lang="scss">
.fore-button {
	display: inline-block;
	height: 1lh;
	aspect-ratio: 1;
}
</style>

<style scoped lang='scss'>
#foottab-tools {
	height: 100%;

	p {
		display: inline-block;
		height: 100%;
		aspect-ratio: 1;
		margin: 0 align-size(tiny);
	}
}
</style>
