<script lang='ts' setup>
import closeSvg from '@/asset/icons/close.svg?raw';
import { PopupBox } from '@ra2inier/wc';
import { EmitType, ListViewState } from './ListViewState';
import { reactive } from 'vue';

const props = defineProps<{ readonly state: ListViewState }>()
const state = reactive(props.state)
const emit = defineEmits<{
	select: EmitType,
	delete: EmitType
}>()

function onSelectChange(...a: EmitType) {
	emit('select', ...a)
	if (!state.singleSelect) return
	state.forEach(el => el.selected = false)
	a[0].selected = true
}

function onDeleteClick(...a: EmitType) {
	emit('delete', ...a)
	state.remove(a[0].id)
}
</script>


<template>
	<div :class="[$style.list, $theme.list]" @select.stop>
		<header>
			<slot></slot>
		</header>
		<section class="list-view">
			<li v-for="(item, order) in state" class="reactive-h">
				<input v-if="state.checkBox" tabindex="-1" type="checkbox" class="normal-button" :id="item.id"
					v-model="item.selected" @change="onSelectChange(item, order)" :disabled="!state.selectable"
					:selected="item.selected">
				<popup-box>
					<label :for="item.id">
						<span>{{ item.value || '?' }}</span>
						<u v-if="state.showDetail && item.detail">({{ item.detail }})</u>
					</label>
					<pre slot="pop" class="popup">
                  <slot name="popup" v-bind="item"></slot>
               </pre>
				</popup-box>
				<i></i>
				<s v-if="state.deleteButton" @click="onDeleteClick(item, order)" v-svgicon="closeSvg"
					class="normal-button"></s>
			</li>
		</section>
		<footer>
			<slot name="footer"></slot>
		</footer>
	</div>
</template>

<style module="$theme" scoped lang="scss">
.list {

	input::after {
		background-color: info-color(detail);
	}
}
</style>

<style module scoped lang='scss'>
.list {
	width: 100%;

	header {
		position: relative;
		z-index: 40;
		height: fit-content;
	}

	section {
		position: relative;
		z-index: 30;
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 1;
	}

	&>*:hover {
		z-index: 888;
	}

	li {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: inherit;
		height: 1lh;
	}

	input {
		position: relative;
		display: block;
		width: 1em;
		flex: 0;
		height: 1em;
		aspect-ratio: 1;
	}

	input::after {
		position: absolute;
		inset: 25%;
		width: 50%;
		height: 50%;
		border-radius: inherit;
	}

	input[selected=true]::after {
		content: '';
	}

	input[selected=true] {
		filter: hue-rotate(30deg);
	}

	input,
	label {
		margin-right: align-size(normal);
	}

	label {
		flex: 0 0 auto;
		display: inline-block;
		height: 100%;
		min-width: 15em;
	}

	popup-box {
		text-align: left;
	}

	u {
		font-size: 0.8em;
	}

	pre {
		position: relative;
		z-index: 100;
		display: flex;
		min-height: 0;
		min-width: 0;
		padding: 0 align-size(normal);
		margin: 0;
	}

	i {
		flex: 1;
	}

	s {
		flex: 0;
		height: 0.7lh;
		aspect-ratio: 1;
	}
}
</style>
