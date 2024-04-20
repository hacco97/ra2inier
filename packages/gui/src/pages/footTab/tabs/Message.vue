<script lang='ts' setup>
import { FootTabType, useFoottabState } from '@/states/footTabList';
import { Ref, computed, inject, reactive } from 'vue';
import clearSvg from '@/asset/icons/clear.svg?raw';
import forbidSvg from '@/asset/icons/forbid.svg?raw';
import { useMessageStore } from '@/stores/messageStore'

defineOptions({ name: 'Message' })
const foottab = useFoottabState()
const message = useMessageStore()
const foldedMap = computed(() => reactive(message.messageList.map(x => true)))

foottab.setMessageBadge(message.messageList.length)

const mounted = <Ref<boolean>>inject('foottab-mounted')

function onClearClick() {
	message.clearAll()
	foottab.setMessageBadge(0)
}

function onReadClick() {
	message.readAll()
	foottab.setMessageBadge(0)
}
</script>


<template>
	<div class="scroll" :class="[$style.message, $theme.message]">
		<li v-for="(msg, id) in message.messageList" :key="msg.id">
			<h2>
				<em>{{ msg.id + 1 }}.</em><i>{{ msg.sender }}</i>
				<em>:&nbsp;</em>
				<b :read="msg.read">[{{ msg.time }}]</b>
			</h2>
			<div :level="msg.level" class="fore-rpanel">
				<span class="folder" v-if="msg.remark" :folded="!foldedMap[id]">&gt;</span>
				<span @click="foldedMap[id] = !foldedMap[id]">{{ msg.content }}</span>
			</div>
			<pre v-if="msg.remark" :level="msg.level" v-show="foldedMap[id]">{{ msg.remark }}</pre>
		</li>
	</div>
	<Teleport v-if="mounted" to="#foottab-tools" :disabled="foottab.selected.type !== FootTabType.Message">
		<lazy-button class="fore-button" :class="$style['icon-margin']" @click="onReadClick">
			<s v-svgicon="forbidSvg" padding="15%"></s>
		</lazy-button>
		<i style="width: 1em;"></i>
		<lazy-button class="fore-button" :class="$style['icon-margin']" @click="onClearClick">
			<s v-svgicon="clearSvg" padding="5%"></s>
		</lazy-button>
	</Teleport>
</template>

<style scoped src="@css/foottab-message.scss" module="$theme" />
<style scoped lang='scss' module>
$align: align-size(normal);

.message {
	overflow: auto;
	height: 100%;
	padding: $align 0;
	@include font-size(normal);

	li {
		margin-bottom: $align;
		padding: 0 $align;
	}

	b {
		position: relative;
	}

	b::after {
		content: '';
		position: absolute;
		top: 50%;
		right: -$align;
		height: 1ch;
		transform: translateY(-50%);
		aspect-ratio: 1;
		border-radius: 50%;
	}

	div {
		width: fit-content;
		padding: 0 $align;
	}

	pre {
		@include font-size(small);
		text-wrap: wrap;
		padding: 0 $align;
	}
}

.icon-margin {
	margin: 0 align-size(tiny);
}
</style>
