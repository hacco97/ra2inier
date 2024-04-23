<script lang='ts' setup>
import { computed, reactive, ref, shallowRef } from 'vue';

import submitSvg from '@/asset/icons/submit.svg?raw';
import ColorPicker from '@/components/ColorPicker.vue';
import { IniObjectRo, WordRo, WordValueType } from '@ra2inier/core';
import { NumberInput, TouchButton } from '@ra2inier/wc';

import { useFloat, useInt } from './number';
import { Option, useObjects, useOption } from './option';
import { usePromptKeymap } from './promptKeymap';
import { PromptState, PromptType, useChildFocus } from './promptState';
import { useProjectStore } from '@/stores/projectStore';
import { EntryRo } from '@/states/Entry';


const props = defineProps({
	disabled: { type: Boolean, default: false },
	state: { type: PromptState, required: true }
})
const emit = defineEmits(['submit', 'blur'])

// 初始化组件参数
const state = props.state
const word = shallowRef(new WordRo)
const store = useProjectStore()
function getWordPath(word: WordRo) {
	if (word.isNull) return 'not found'
	return `${store.packageNames[word.package]}/${word.dictionary}/${word.fullname}`
}
const author = computed(() => word.value.author ? '作者：' + word.value.author : '')

// 提示框焦点控制逻辑
function onPromptFocus() {
	state.isFocus = true
}
function onPromptBlur() {
	state.isFocus = false
	setTimeout(() => {
		if (state.isFocus) return
		state.isFocus = false
		emit('blur')
		state.unactive()
	}, 10)
}

// 子元素焦点focus逻辑，该逻辑用于通过使用emit触发，使得Prompt内部子元素的主动focus
const { vChildFocus, focusChild } = useChildFocus()
state.on('focus-child', () => { focusChild(state.type) })


// 键盘处理逻辑
const vKeymap = usePromptKeymap(state)
function onPromptSubmit(e: KeyboardEvent) {
	e.stopPropagation()
	if (e.key === 'Enter')
		submit(getValue())
}
function submit(ret: string | number) {
	state.entry.setValue(ret)
	state.unactive()
	ret !== undefined && emit('submit', ret)
}


// 枚举类型的处理逻辑
const { options, cursor: optionCursor } = useOption(state)
function onOptionClick(id: number) {
	state.active()
	optionCursor.value = id
}
function onOptionDblClick(option: Option) {
	submit(option.value)
}

// 整数类型的处理逻辑
const { intInput, changeInt, getInt, isValid: intValid } = useInt(state)
function onIntSubmit(e: Event) {
	intValid() && submit(getInt())
}
const min = ref(Number.MIN_SAFE_INTEGER), max = ref(Number.MAX_SAFE_INTEGER)
state.on('entry-change', (e: EntryRo) => {
	word.value = store.queryWord(e.wordName)
	const param = word.value.valueParam[e.vid]
	if (param?.type === WordValueType.int) {
		min.value = param.min ?? Number.MIN_SAFE_INTEGER
		max.value = param.max ?? Number.MAX_SAFE_INTEGER
	}
})

// 浮点类型的处理逻辑
const { floatInput, changeFloat, getFloat, isValid: floatValid } = useFloat(state)
function onFloatSubmit(e: Event) {
	floatValid() && submit(getFloat())
}

// 颜色类型
const color = reactive({ red: 0, green: 70, blue: 50 })
function getColor() {
	return `${Math.round(color.red)},${Math.round(color.green)},${Math.round(color.blue)}`
}
function onColorSubmit() {
	if (!state.entry) return
	submit(getColor())
}

// 对象类型
const { objects, cursor: objectCursor } = useObjects(state)
function getObjectPath(o: IniObjectRo) {
	return `${store.packageNames[o.package]}/${o.group}/${o.name}.${o.scope}`
}
function onObjectClick(id: number) {
	state.active()
	objectCursor.value = id
}
function onObjectDbclick(object: IniObjectRo) {
	submit(object.name)
}
function getObject() {
	return objects.value[objectCursor.value].name
}

/**
 * 获取当前值
 */
const valueMap: Record<PromptType, Function> = {
	[PromptType.enum]() { return options[optionCursor.value].value },
	[PromptType.int]: getInt,
	[PromptType.float]: getFloat,
	[PromptType.color]: getColor,
	[PromptType.new]() { },
	[PromptType.obj]: getObject,
	[PromptType.str]() { },
}

/**
 * 提交值的逻辑
 */
function getValue() {
	return valueMap[state.type]()
}
state.on('submit-request', () => submit(getValue()))

</script>


<template>
	<div v-if="!disabled" :class="[$style.prompt, $theme.prompt]" v-keymap @keydown="onPromptSubmit"
		@focusin.stop="onPromptFocus" @focusout.stop="onPromptBlur">
		<h2>
			<h3 :title="author">{{ state.entry?.wordName }}</h3>
			<h4>{{ getWordPath(word) }}</h4>
			<hr>
			<li v-if="word.brief">{{ word.brief }}</li>
			<li v-if="word.default">默认值：{{ word.default }}</li>
			<li v-if="word.values">取值：{{ word.values }}</li>
		</h2>

		<!-- 枚举类型 -->
		<ol :class="$style.enum" class="scroll" v-child-focus="PromptType.enum" v-show="state.type === PromptType.enum">
			<li class="normal-rpanel reactive-hcs" v-for="option in options" :key="option.id"
				:selected="optionCursor === option.id && state.isActive" @click="onOptionClick(option.id)"
				@dblclick="onOptionDblClick(option)">
				<span>{{ option.value }}</span>
				<span>{{ option.text }}</span>
			</li>
		</ol>

		<!-- 整数类型 -->
		<ul :class="$style.number" v-show="state.type === PromptType.int">
			<touch-button @touch="changeInt(-10)">--</touch-button>
			<touch-button @touch="changeInt(-1)">-</touch-button>
			<number-input ref="intInput" @keydown.enter.stop="onIntSubmit" :min="min" :max="max"
				v-child-focus="PromptType.int" />
			<touch-button @touch="changeInt(1)">+</touch-button>
			<touch-button @touch="changeInt(10)">++</touch-button>
			<p class="normal-label" v-svgicon="submitSvg" padding="18%" @click="onIntSubmit"></p>
		</ul>

		<!-- 小数类型 -->
		<ul :class="$style.number" v-show="state.type === PromptType.float">
			<touch-button @touch="changeFloat(-0.1)">--</touch-button>
			<touch-button @touch="changeFloat(-0.01)">-</touch-button>
			<number-input ref="floatInput" @keydown.enter.stop="onFloatSubmit" precision="2" min="0" max="1"
				v-child-focus="PromptType.float" />
			<touch-button @touch="changeFloat(0.01)">+</touch-button>
			<touch-button @touch="changeFloat(0.1)">++</touch-button>
			<p class="normal-label" v-svgicon="submitSvg" padding="18%" @click="onFloatSubmit"></p>
		</ul>

		<!-- 颜色类型 -->
		<div v-show="state.type === PromptType.color">
			<ColorPicker v-child-focus="PromptType.color" :color="color" @submit="onColorSubmit" />
			<footer style="height: 10px;"></footer>
		</div>

		<!-- 对象类型 -->
		<div :class="$style.enum" class="scroll" v-show="state.type === PromptType.obj" v-child-focus="PromptType.obj">
			<li class="normal-rpanel reactive-hcs" v-for="(object, id) in objects" :key="id"
				:selected="objectCursor === id && state.isActive" @click="onObjectClick(id)"
				@dblclick="onObjectDbclick(object)">
				<span :title="getObjectPath(object)">{{ object.name }}.{{ object.scope }}</span>
			</li>
		</div>
	</div>
</template>

<style scoped src="@css/prompt.scss" module="$theme"></style>

<style scoped lang='scss' module>
.prompt {
	width: fit-content;
	height: fit-content;
	min-width: 300px;
	padding: align-size(normal);

	h2 {
		line-height: 1.2em;

		>* {
			height: 1lh;
			margin: align-size(tiny) 0;
		}

		h3 {
			padding: 0 align-size(large);
			font-weight: bolder;
		}

		h4 {
			font-size: 0.8em;
		}

		hr {
			display: block;
			height: 1px !important;
			width: 100%;
		}

		li {
			white-space: nowrap;
		}
	}

	text-align: left;
	cursor: default;

	p {
		height: 50px;
	}
}

.enum {
	overflow-x: auto;
	max-height: 10lh;

	>li {
		display: flex;
		justify-content: space-between;
		height: 1lh;
		padding: 0 align-size(normal);
	}
}

.number {
	display: flex;
	align-items: center;
	height: line-height(larger);
	padding: align-size(normal);
	text-align: center;

	number-input {
		flex: 1;
		display: block;
		height: 100%;
		width: 100%;
		padding: 0 align-size(normal);
	}

	touch-button {
		flex: 0;
		display: inline-block;
		height: 100%;
		aspect-ratio: 1;
	}

	p {
		height: 100%;
		aspect-ratio: 1;
	}

}
</style>
