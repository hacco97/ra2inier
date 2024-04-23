<script lang='ts' setup>
import pkgSvg from '@/asset/icons/package.svg?raw';
import groupSvg from '@/asset/icons/group.svg?raw';
import ObjView from './ObjView.vue';
import { PkgViewProp, createPkgViewState, useVFold } from './pkgViewState';
import { useGroupCtxmenu, usePkgviewCtxmenu } from './pkgCtxmenu'
import { FlexInput } from '@ra2inier/wc';
import { useFolder } from '@/hooks/folder';
import { useStatusState } from '@/states/status';

const props = defineProps<PkgViewProp>()
const pkgViewState = createPkgViewState(props)
const { view, onObjectOpen, renameGroup } = pkgViewState
const { getFolderStyle, getFoldedStyle, flip, isGroupFoldedMap } = useVFold(pkgViewState)
const vGroupMenu = props.isMain ? useGroupCtxmenu(pkgViewState) : {}
const vPkgviewMenu = props.isMain ? usePkgviewCtxmenu(pkgViewState) : {}

function onGroupNameChange(input: FlexInput, gkey: string) {
	renameGroup(gkey, input.value)
	getSelection()?.removeAllRanges()
}

function onGroupNameBlur(input: FlexInput) {
	input.setAttribute('disabled', 'true')
	getSelection()?.removeAllRanges()
}


const status = useStatusState()
function onPackageNameEnter() {
	status.setStatusText(props.pkg.fullname)
}

const { folded, vFolder } = useFolder(undefined, !props.isMain)
</script>


<template>
	<div :class="$style.pkgview">
		<h1 class="list-item normal-panel" v-pkgview-menu @click="folded = !folded">
			<q class="vertical-center" @mouseenter="onPackageNameEnter">
				<b v-folder @click.stop>&gt;</b>
				<p v-svgicon="pkgSvg" style="height: 1lh;" padding="3%"></p>
				<span>{{ pkg.name }}</span>
			</q>
			<!-- <aside>
            <s v-svgicon="addSvg" class="fore-button" v-if="isMain" @click.stop="onAddClick()"></s>
         </aside> -->
		</h1>
		<section v-show="!folded">
			<ul v-for="(group, gkey) of view" :key="gkey" :style="getFoldedStyle(gkey)" v-group-menu="gkey">
				<!-- 组的标题 -->
				<h2 class="list-item" @click="flip(gkey)">
					<b class="folder" :style="getFolderStyle(gkey)" :folded="isGroupFoldedMap[gkey]">&gt;</b>
					<p v-svgicon="groupSvg" padding="0"></p>
					<flex-input class="group-name" :value="gkey" @change="onGroupNameChange($event.target, gkey)"
						disabled="true" :placeholder="gkey" @blur="onGroupNameBlur($event.target)"></flex-input>
				</h2>
				<ol v-for="(object, key) of group" :key="key">
					<!-- 对象 -->
					<div v-if="!object.parent">
						<ObjView :object="object" :key="key" :readonly="!isMain" @open="onObjectOpen"></ObjView>
					</div>
				</ol>
			</ul>
		</section>
	</div>
</template>

<style scoped lang='scss' module>
$header-height: line-height(small);
$line-height: line-height(tiny);
$padding: align-size(normal);

.pkgview {
	display: flex;
	flex-direction: column;
	position: relative;

	h1 {
		position: relative;
		z-index: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: nowrap;
		height: $header-height;
		padding-left: $padding;
		order: 0;

		@include font-size(normal);

		aside {
			display: flex;
			align-items: center;
		}

		s {
			display: inline-block;
			height: 0.8lh;
			aspect-ratio: 1;
			margin-left: align-size(small);
		}
	}

	p {
		display: inline-block;
		height: 1lh;
		aspect-ratio: 1;
	}

	flex-input {
		font-size: inherit;
		pointer-events: none;

		&[disabled=false] {
			text-decoration: underline;
			pointer-events: unset;
			cursor: text;
		}
	}

	h2 {
		display: flex;
		align-items: center;
		height: $header-height;
		padding-left: $padding ;
	}

	ul {
		overflow: hidden;
	}
}
</style>
