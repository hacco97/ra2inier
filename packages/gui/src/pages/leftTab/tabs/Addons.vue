<script lang='ts'>
import { defineComponent } from 'vue';

import LeftTabLayout from './Layout.vue';

export default defineComponent({
  name: 'Addons',
  components: { LeftTabLayout },
  setup() {


    return {



    }
  }
})
</script>


<template>
  <LeftTabLayout>
    <template #header>
      <div>MOD工具箱</div>
    </template>
    <template #panel>
      <li>word</li>
      <p>hello</p>
      <div>adsf</div>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, ex.</p>
      <p>Pariatur adipisci consectetur asperiores quia minima odio molestias, cumque voluptate.</p>
      <p>Animi nihil quos maiores rem at, vero magnam soluta veritatis?</p>
      <p>Eum dolorum dolor dolores neque aliquid laborum minima sed ea.</p>
      <p>Totam delectus odio ducimus commodi, nostrum recusandae tenetur doloremque accusantium!</p>
    </template>
  </LeftTabLayout>
</template>

<style scoped lang='scss'></style>
