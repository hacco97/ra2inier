<script lang='ts' setup>
import { FootTabType, useFoottabState } from '@/states/footTabList';
import { Ref, inject } from 'vue';
import clearSvg from '@/asset/icons/clear.svg?raw';
import forbidSvg from '@/asset/icons/forbid.svg?raw';
import { useMessageStore } from '@/stores/messageStore'


defineOptions({ name: 'Message' })
const foottab = useFoottabState()
const message = useMessageStore()

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
      <li v-for="msg in message.messageList" :key="msg.id" :level="msg.level">
         <em>{{ msg.id + 1 }}.</em><i>{{ msg.sender }}</i>:&nbsp;<b :read="msg.read">[{{ msg.time }}]</b>
         <div><i>{{ msg.content }}</i></div>
         <pre v-if="msg.remark"><span>{{ msg.remark }}</span></pre>
      </li>
   </div>
   <Teleport v-if="mounted" to="#foottab-tools" :disabled="foottab.selected.type !== FootTabType.Message">
      <lazy-button class="fore-button" :class="$style['icon-margin']" @click="onClearClick">
         <s v-svgicon="clearSvg" padding="5%"></s>
      </lazy-button>
      <lazy-button class="fore-button" :class="$style['icon-margin']" @click="onReadClick">
         <s v-svgicon="forbidSvg" padding="15%"></s>
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

   li {
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

   pre {
      text-wrap: wrap;
   }
}

.icon-margin {
   margin: 0 align-size(tiny);
}
</style>
