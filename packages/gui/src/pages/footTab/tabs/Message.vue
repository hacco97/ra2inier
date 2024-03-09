<script lang='ts' setup>
import { setMessageBadge } from '@/states/footTabList';
import { messageList } from '@/stores/messageStore';

defineOptions({ name: 'Message' })
setMessageBadge(messageList.length)
</script>


<template>
   <div class="scroll" :class="[$style.message, $theme.message]">
      <li v-for="msg in messageList" :key="msg.id" :level="msg.level">
         <em :read="msg.read">{{ msg.id + 1 }}.</em><i>{{ msg.sender }}</i>:&nbsp;<b>[{{ msg.time }}]</b>
         <div><i>{{ msg.content }}</i></div>
         <pre v-if="msg.remark"><span>{{ msg.remark }}</span></pre>
      </li>
   </div>
</template>

<style scoped src="@css/foottab.scss" module="$theme" />
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
</style>
