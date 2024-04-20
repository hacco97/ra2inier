<script lang='ts' setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import submitSvg from '@/asset/icons/submit.svg?raw';
import { useFocus } from '@/hooks/focus';
import { useKeyMap } from '@/hooks/keymap';
import { NumberInput } from '@ra2inier/wc';

import { hsv2rgb, HsvColor, rgb2hsv, RgbColor } from './ColorPickerUtils';

const props = defineProps<{ color: RgbColor }>()
const emit = defineEmits(['submit'])
const hsv = reactive<HsvColor>({
	hue: 100,
	saturation: 1,
	value: 1
})

const rgb = reactive<RgbColor>(props.color)
watch(() => props.color, doRgb2hsv, { immediate: true, once: true })

//HUE 滚动条的逻辑
const hueX = computed(() => ({
	translate: Math.round(hsv.hue / 360 * 100) + '%',
}))
const hueColor = computed(() => `hsl(${Math.round(hsv.hue)},100%,50%)`)

const isHueSliderShowed = ref(false)
function onHueMousedown(e: MouseEvent) {
	isHueSliderShowed.value = true
	onHuePanelClick(e)
}

var isHsv2RgbDoing = false
function doHsv2Rgb() {
	if (isHsv2RgbDoing) return
	isHsv2RgbDoing = true
	const rgbList = hsv2rgb(hsv)
	rgb.red = rgbList[0]
	rgb.green = rgbList[1]
	rgb.blue = rgbList[2]
	isHsv2RgbDoing = false
}

function onHuePanelClick(e: MouseEvent) {
	const el = <HTMLElement>e.target
	hsv.hue = e.offsetX / el.clientWidth * 360
	doHsv2Rgb()
}


function onHueSliderMove(e: MouseEvent) {
	const el = <HTMLElement>e.target
	// 设置了滑板的宽度比色板的宽度更宽，需要进行宽度修正
	let tmp = (e.offsetX - 10) / (el.clientWidth - 20) * 360
	if (tmp < 0) tmp = 0
	if (tmp > 360) tmp = 360
	hsv.hue = tmp
	doHsv2Rgb()
}

// Saturation和Value的面板逻辑
const currentColor = computed(() => `rgb(${rgb.red},${rgb.green},${rgb.blue})`)

const isPanelShowed = ref(false)
const cursorPosition = computed(() => ({
	translate: `${Math.round(hsv.saturation * 100)}% ${Math.round(100 - hsv.value * 100)}%`
}))

function onPanelMousedown(e: MouseEvent) {
	isPanelShowed.value = true
	onPanelClick(e)
}

const panel = ref<HTMLDivElement>()
const panelSize = {
	get width() {
		return panel.value!.clientWidth
	},
	get height() {
		return panel.value!.clientHeight
	}
}
function onPanelClick(e: MouseEvent) {
	hsv.saturation = e.offsetX / panelSize.width
	hsv.value = 1 - (e.offsetY / panelSize.height)
	doHsv2Rgb()
}

function onPanelMousemove(e: MouseEvent) {
	let s = (e.offsetX - 10) / panelSize.width
	if (s > 1) s = 1
	if (s < 0) s = 0
	hsv.saturation = s
	let v = 1 - ((e.offsetY - 10) / panelSize.height)
	if (v > 1) v = 1
	if (v < 0) v = 0
	hsv.value = v
	doHsv2Rgb()
}

// rgb输入框的反向转化逻辑
function onRgbChange() {
	doRgb2hsv()
}

var isRgb2HsvDoing = false
function doRgb2hsv() {
	if (isRgb2HsvDoing) return
	isRgb2HsvDoing = true
	const hsvList = rgb2hsv(rgb)
	hsv.hue = hsvList[0]
	hsv.saturation = hsvList[1]
	hsv.value = hsvList[2]
	isRgb2HsvDoing = false
}

// 交互逻辑
function onSubmit() {
	emit('submit')
}
const { directive: vFocus, focusNext, focusPrev } = useFocus()
const vKeymap = useKeyMap({
	arrowdown() { focusNext() },
	arrowup() { focusPrev() }
}, { prevent: true, stop: true })

// 将根节点的焦点替换到hueInput上
const hueInput = ref<HTMLElement>(), root = ref<HTMLDivElement>()
onMounted(() => {
	root.value!.focus = () => { hueInput.value?.focus() }
})


const selected = ref(false)
</script>

<template>
	<div :class="[$style.picker, $theme.picker]" v-keymap @mousemove="$event.stopPropagation()" tabindex="-1" ref="root">
		<ol ref="panel" :style="{ 'background-color': hueColor }" @mousedown="onPanelMousedown">
			<li></li>
			<li></li>
			<p :style="cursorPosition"><b :style="{ 'border-color': currentColor }"></b></p>
			<i v-show="isPanelShowed" @mousemove="onPanelMousemove" @mouseup="isPanelShowed = false"
				@mouseleave="isPanelShowed = false"></i>
		</ol>
		<hr>
		<section>
			<div @mousedown="onHueMousedown">
				<p :style="hueX"><b :style="{ '--hue-color': hueColor }"></b></p>
				<i v-show="isHueSliderShowed" @mousemove="onHueSliderMove" @mouseup="isHueSliderShowed = false"
					@mouseleave="isHueSliderShowed = false"></i>
			</div>
			<span>H</span>
			<number-input v-bind="$attrs" ref="hueInput" tabindex="-1" v-focus="0" v-model.lazy="hsv.hue"
				@change="doHsv2Rgb" class="rd ol-n" min="0" max="360" />
		</section>
		<hr>
		<ul>
			<span>R</span>
			<number-input tabindex="-1" v-focus="1" v-model.lazy="rgb.red" @change="onRgbChange" min="0" max="255" />
			<span>G</span>
			<number-input tabindex="-1" v-focus="2" v-model.lazy="rgb.green" @change="onRgbChange" min="0" max="255" />
			<span>B</span>
			<number-input tabindex="-1" v-focus="3" v-model.lazy="rgb.blue" @change="onRgbChange" min="0" max="255" />
			<p tabindex="-1" v-focus="4" class="normal-label" v-svgicon="submitSvg" @click="onSubmit" padding="0"
				@keydown.enter="onSubmit" :selected="selected" @focus="selected = true" @blur="selected = false"></p>
		</ul>
	</div>
</template>

<style scoped lang="scss" module="$theme">
.picker {
	@include outline-box();

	number-input {
		@include normal-panel();
		@include plane-radius(normal);
	}
}
</style>

<style scoped lang='scss' module>
.picker {
	position: relative;
	width: 100%;
	text-align: center;
	line-height: inherit;

	>ol {
		position: relative;
		z-index: auto;
		width: 100%;
		height: 200px;
		background: red;

		li {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			pointer-events: none;
		}

		li:nth-child(1) {
			z-index: 1;
			background: linear-gradient(to right, white, rgba(255, 255, 255, 0));
		}

		li:nth-child(2) {
			z-index: 2;
			background: linear-gradient(to top, black, rgba(0, 0, 0, 0));
		}

		p {
			position: absolute;
			z-index: 21;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			translate: 50% 50%;
			pointer-events: none;

			b {
				display: block;
				width: 14px;
				height: 14px;
				border: align-size(tiny) solid aqua;
				border-radius: 7px;
				transform: translate(-50%, -50%);
				filter: invert(100%) brightness(1.6);
			}
		}

		i {
			position: absolute;
			z-index: 20;
			top: -10px;
			left: -10px;
			display: block;
			width: calc(100% + 20px);
			height: calc(100% + 20px);
		}
	}

	hr {
		display: block;
		height: 10px;
	}

	>section {
		position: relative;
		z-index: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 1lh;

		>div {
			position: relative;
			z-index: 1;
			flex: 1;
			height: 100%;
			background: linear-gradient(to right,
					rgb(255, 0, 0) 0%,
					rgb(255, 255, 0) 16.67%,
					rgb(0, 255, 0) 33.33%,
					rgb(0, 255, 255) 50%,
					rgb(0, 0, 255) 66.67%,
					rgb(255, 0, 255) 83.33%,
					rgb(255, 0, 0) 100%);

			>p {
				width: 100%;
				height: 100%;
				position: relative;
				z-index: 2;
				translate: 50px 0;
				pointer-events: none;
			}

			>i {
				position: absolute;
				z-index: 1;
				top: -10px;
				left: -10px;
				display: block;
				width: calc(100% + 20px);
				height: calc(100% + 20px);
				pointer-events: all;
			}

			b {
				display: block;
				width: 2px;
				height: 100%;
				translate: -50% 0;
				outline: 2px solid black;
				background-color: white;

				&::before {
					content: '';
					display: block;
					position: absolute;
					box-sizing: border-box;
					left: 50%;
					translate: -50%;
					width: 14px;
					height: 10px;
					border-left: 7px solid transparent;
					border-right: 7px solid transparent;
				}

				&::before {
					top: -9px;
					border-top: 7px solid var(--hue-color);
					border-bottom: 7px solid transparent;
				}
			}
		}

		>span {
			display: block;
			flex: 0 0 auto;
			margin-left: align-size(normal);
		}

		>number-input {
			display: block;
			flex: 1;
			height: 100%;
			max-width: max(5ch, 50px);
		}
	}

	>ul {
		display: flex;
		justify-content: space-around;
		height: 1lh;
		line-height: inherit;
		align-items: center;

		>span {
			flex: 0 0 auto;
			margin-left: align-size(normal);
		}

		>number-input {
			display: block;
			flex: 1;
			min-width: min(5ch, 50px);
			height: 100%;
		}

		>p {
			flex: 0 0 min(5ch, 50px);
			min-width: min(5ch, 50px);
			height: 100%;
			margin: align-size(normal);
		}
	}
}
</style>
