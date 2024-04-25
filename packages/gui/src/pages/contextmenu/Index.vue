<script lang='ts' setup>
import { onMounted, reactive } from 'vue';
import closeSvg from '@/asset/icons/unfull.svg?raw';
import moveSvg from '@/asset/icons/move.svg?raw';
import { useCtxMenuState } from '@/states/ctxMenu';
import { useLayoutState } from '@/states/layout';
import { PopupBox } from '@ra2inier/wc';


defineOptions({ name: 'ContextMenu' })
const ctxmenu = useCtxMenuState()
const layout = useLayoutState()
const vCtxmenu = ctxmenu.vCtxmenu

const wavePosition = reactive({ translate: '100px 100px' })
onMounted(() => {
	document.body.addEventListener('click', (e: MouseEvent) => {
		wavePosition.translate = `${e.clientX}px ${e.clientY}px`
	})
})

</script>


<template>
	<div id="mask" :class="[$style.mask, $theme.mask]" v-show="layout.isMasked">
		<span>
			<s v-svgicon="moveSvg" class="fore-button" style="-webkit-app-region: drag;"></s>
			<s v-svgicon="closeSvg" padding="15%" class="fore-button" @click="layout.closeMask()"></s>
		</span>
	</div>
	<!-- <li :class="$style.radius" :style="wavePosition"><span></span></li> -->
	<ul id="ctxmenu" v-ctxmenu :class="[$style['context-menu'], $theme['context-menu']]" class="scrollx normal-panel"
		v-show="ctxmenu.isCtxMenuShowed" :style="ctxmenu.ctxMenuPostion">
		<li v-for="item in ctxmenu.ctxMemuItems" @click="item.callback" v-show="item.enabled"
			class="fore-panel reactive-hc">
			{{ item.label }}
		</li>
	</ul>
</template>

<style scoped src="@css/ctx-menu.scss" module="$theme" />
<style scoped>
.showed-mask {
	height: 100vh !important;
}
</style>
<style scoped lang='scss' module>
.context-menu {
	position: absolute;
	top: 0;
	left: 0;
	@include z-index(ctxmenu);
	height: fit-content;
	width: fit-content;
	padding: align-size(normal) 0;
	max-width: 20em;
	overflow-x: auto;
	overflow-y: hidden;

	li {
		min-width: 10em;
		padding: align-size(small) align-size(large);
	}
}


.mask {
	display: block;
	position: absolute;
	@include z-index(mask);
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	overflow: hidden;

	span {
		display: block;
		position: absolute;
		width: fit-content;
		@include z-index(mask);
		right: align-size(small);
		top: align-size(small);
	}

	s {
		display: inline-block;
		width: line-height(normal);
		aspect-ratio: 1;
		margin: 0 align-size(tiny);
	}
}


@keyframes wave {
	from {
		width: 2px;
		height: 2px;
		opacity: 1;
	}

	to {
		width: 40px;
		height: 40px;
		opacity: 0;
	}
}

.radius {
	position: absolute;
	@include z-index(mask);
	width: 0;
	height: 0;
	overflow: visible;
	pointer-events: none;

	span {
		display: block;
		border-radius: 50%;
		background-color: red;
		translate: -50% -50%;
		animation: wave 1s ease-out;
		visibility: hidden;
	}
}
</style>
