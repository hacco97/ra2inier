<script lang='ts' setup>
import { messageList } from '@/stores/messageStore'
import { setMessageBadge } from '@/states/footTabList'
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
.message {
   overflow: auto;
   height: 100%;
   padding: 1em 0;

   li {
      padding: 1ch 1em;
   }

   b {
      position: relative;
   }

   b::after {
      content: '';
      position: absolute;
      top: 40%;
      right: -1ch;
      height: 30%;
      aspect-ratio: 1;
      /* background-color: red; */
      border-radius: 50%;
   }
}
</style>
