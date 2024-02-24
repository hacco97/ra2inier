<script lang='ts'>
import { defineComponent } from 'vue'
import LeftTabLayout from './Layout.vue'

export default defineComponent({
  name: 'Resource',
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
      <div>素材管理</div>
    </template>
    <template #panel>
      <ul>
        <!-- <li v-for=""></li> -->
      </ul>
    </template>
  </LeftTabLayout>
</template>

<style scoped lang='scss'></style>
