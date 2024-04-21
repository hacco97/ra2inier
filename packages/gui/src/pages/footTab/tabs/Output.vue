<script lang='ts' setup>
import { computed, inject, Ref } from 'vue';

import playSvg from '@/asset/icons/compile.svg?raw';
import openDirSvg from '@/asset/icons/openDir.svg?raw';
import { FootTabType, useFoottabState } from '@/states/footTabList';
import { useConfigStore } from '@/stores/config';
import { FlexInput, LazyButton } from '@ra2inier/wc';
import { openDirectory } from '@/boot/file';
import { useLayoutState } from '@/states/layout';

defineOptions({ name: 'Output' })
const { config, set } = useConfigStore()

const foottab = useFoottabState()
const { footTabSize } = useLayoutState()

function onOutputClick() {
	// build()
}

const outDir = computed({
	get() { return config.OUTPUT_DIR ?? "" },
	set(val: string) { set('OUTPUT_DIR', val) }
})

async function onOpenPathClick() {
	const path = await openDirectory()
	path && (outDir.value = path[0])
}

// foottab的自定义按钮逻辑
const mounted = <Ref<boolean>>inject('foottab-mounted')

const tabindex = computed(() => footTabSize.height > 100 ? 0 : -1)
</script>


<template>
	<div class="scroll list-view" :class="$style.output">
		<li>
			<span>输出目录：</span>
			<flex-input class="fore-rpanel" :value="outDir" :placeholder="outDir" :tabindex="tabindex"></flex-input>
			<lazy-button class="fore-button" @click="onOpenPathClick">
				<s v-svgicon="openDirSvg" padding="15%"></s>
			</lazy-button>
		</li>
	</div>
	<Teleport v-if="mounted" to="#foottab-tools" :disabled="foottab.selected.type !== FootTabType.Output">
		<lazy-button class="fore-button" :class="$style['icon-margin']" @click="onOutputClick">
			<s title="构建" v-svgicon="playSvg"></s>
		</lazy-button>
	</Teleport>
</template>

<style scoped lang='scss' module>
$align: align-size(normal);

.output {
	padding: $align 0;

	li {
		display: flex;
		align-items: center;
		padding: 0 $align;

		span {
			float: left;
		}
	}

	flex-input {
		display: block;
		padding: 0 1ch;
		margin-right: $align;
	}

	s {
		display: block;
		height: 1lh;
		aspect-ratio: 1;
	}
}


.icon-margin {
	margin: 0 align-size(tiny);
}
</style>
