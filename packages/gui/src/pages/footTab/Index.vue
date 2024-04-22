<script lang="ts" setup>
import { KeepAlive, onMounted, provide, ref } from 'vue';
import arrowRight from '@/asset/icons/arrowRight.svg?raw';
import minSvg from '@/asset/icons/min.svg?raw';
import fix from '@/asset/icons/fix.svg?raw';
import Dialog from './tabs/Dialog.vue';
import Message from './tabs/Message.vue';
import Output from './tabs/Output.vue';
import Recycle from './tabs/Recycle.vue';
import { useLayoutState } from '@/states/layout';
import { FootTab, useFoottabState } from '@/states/footTabList';
import { useFootTabDrag } from './state'

defineOptions({
	name: 'FootTab',
	components: { Dialog, Output, Message, Recycle }
})
defineEmits(['toggleTab'])

const { footTabSize, tryUnFocusFoottab } = useLayoutState()
const foottab = useFoottabState()

//选项卡开启与关闭
function onTabClick(tab: FootTab) {
	if (foottab.selected.id === tab.id) {
		if (footTabSize.height <= 25) {
			footTabSize.height = 300
		} else {
			footTabSize.min()
		}
	}
	foottab.selectFootTab(tab)
}

const isFixSelected = ref(false)

function onFocusout() {
	footTabSize.active = false
	if (isFixSelected.value) return
	setTimeout(tryUnFocusFoottab, 20)
}

// 选项卡拖动逻辑
const { onTabDragStart, onTabDrop } = useFootTabDrag()
const focusHandle = ref<HTMLElement>()
footTabSize.on('resized', () => {
	focusHandle.value?.focus()
})

// 给子组件提供通知，启动Teleport的渲染
const mounted = ref(false)
provide('foottab-mounted', mounted)
onMounted(() => { mounted.value = true })
</script>

<template>
	<div id="foottab" ref="focusHandle" :class="$style.foottab" @focusout="onFocusout"
		@focusin="footTabSize.active = true" tabindex="-1">
		<nav class="scrollx" :class="$theme['foottab-nav']" v-scrollx>
			<ul :class="[$theme['foottab-nav-label'], $style.list]" class="footnav">
				<b></b>
				<div v-for="tab in <FootTab[]>foottab.footTabList" @click="onTabClick(tab)" draggable="true" :key="tab.id"
					@drop="onTabDrop($event, tab)" @dragstart="onTabDragStart($event, tab)" @dragover.prevent
					:style="{ order: tab.order }">
					<li :selected="foottab.selected.id === tab.id">
						<span v-svgicon="tab.label" padding="13%"></span>
						<b>{{ tab.name }}</b>
						<em style="visibility: hidden;">{{ tab.badge }}</em>
					</li>
					<s v-if="tab.badge">{{ tab.badge }}</s>
				</div>
				<i></i>
				<!-- 脚部tab工具按钮 -->
				<p title="最大化" v-svgicon="arrowRight" style="rotate: -90deg;" @click="footTabSize.max()"></p>
				<p title="最小化" v-svgicon="arrowRight" style="rotate: 90deg;" @click="footTabSize.min()"></p>
				<q title="折叠" v-svgicon="minSvg" padding="15%" :selected="footTabSize.canHidden"
					@click="footTabSize.canHidden = !footTabSize.canHidden"></q>
				<q title="固定" v-svgicon="fix" :selected="isFixSelected" @click="isFixSelected = !isFixSelected"></q>
				<span id="foottab-tools" :class="$style['foottab-tools']"></span>
			</ul>
		</nav>
		<hr :class="$theme['decoration-line']">
		<main>
			<KeepAlive>
				<component :is="foottab.selected.type" :key="foottab.selected.type"></component>
			</KeepAlive>
		</main>
	</div>
</template>

<style scoped src="@css/foottab.scss" module="$theme" />
<style scoped lang="scss" module>
$height: layout-size(foottab);

.foottab {
	height: 100%;
	line-height: line-height(normal);

	>nav {
		height: $height;
		overflow: hidden;
	}

	>main {
		height: calc(100% - $height);
		min-width: 0;
	}
}

ul.list {
	display: flex;
	flex-wrap: nowrap;
	z-index: auto;
	height: 100%;
	overflow: hidden;

	>b {
		width: align-size(tiny);
	}

	>div {
		position: relative;
		flex: 0 0 auto;
		margin: 0 align-size(tiny);

		s {
			position: absolute;
			display: block;
			top: align-size(tiny);
			right: align-size(small);
			height: align-size(large);
			line-height: align-size(large);
			aspect-ratio: 1;
			text-align: center;
		}
	}

	li {
		display: flex;
		align-items: center;
		height: 100%;

		padding: 0 align-size(normal);
		overflow: hidden;

		>span {
			height: 100%;
			aspect-ratio: 1;
			overflow: hidden;
		}
	}

	>i {
		order: 5;
		display: block;
		width: 2em;
		height: 100%;
	}

	>p,
	>q {
		height: 100%;
		aspect-ratio: 1;
		margin: 0 align-size(tiny);
		order: 10;
	}
}

.foottab-tools {
	display: flex;
	height: 100%;
	width: fit-content;
	order: 15;
}
</style>
