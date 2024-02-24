<script lang='ts' setup>
import { onBeforeUnmount, ref } from 'vue'
import { focusAnElement } from '@/hooks/focus'
import { useKeyMap } from '@/hooks/keymap';
defineOptions({ name: 'TextBox' })
interface Prop {
   text?: string,
   clazz?: string,
   disabled: boolean
}
defineProps<Prop>()
const emit = defineEmits(['update:text', 'focus:up', 'focus:down'])

const textbox = ref<HTMLElement>()

function onBlur(e: Event) {
   emit('update:text', (e.target as HTMLElement).innerText.trim())
}

onBeforeUnmount(() => {
   emit('update:text', textbox.value?.innerText.trim())
})

function onRootFocus() {
   focusAnElement(textbox.value)
}

const vKeymap = useKeyMap({
   'ctrl+s'() { emit('update:text', textbox.value?.innerText.trim()) },
   'ctrl+arrowup'() { emit('focus:up') },
   'ctrl+arrowdown'() { emit('focus:up') }
})
</script>

<template>
   <div class="local-textbox rd2" :class="clazz" :tabindex="disabled ? -1 : 0" @focus="onRootFocus">
      <div class="scrollx  c-bg-l" v-scrolls :disabled="disabled">
         <pre ref="textbox" :contenteditable="!disabled" v-text="text" v-keymap class="text-box" @blur="onBlur"></pre>
      </div>
   </div>
</template>

<style lang="scss" scoped>
.local-textbox {
   width: 100%;
   user-select: text;
   cursor: default;
}

.scrollx {
   padding: 1em;
   width: 100%;

   &[disabled=true] {
      background-color: var(--color-background-normal);
   }
}

.text-box {
   display: block;
   padding: 0;
   margin: 0;
   min-height: 1em;
   width: 100%;
   min-width: fit-content;

   &[contenteditable=true] {
      cursor: text;
   }
}
</style>
