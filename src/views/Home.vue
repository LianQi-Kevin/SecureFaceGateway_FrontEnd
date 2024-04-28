<script setup>
import {ElMessage} from "element-plus";
import {Pointer} from "@element-plus/icons-vue";

const count = ref(0)
</script>

<template>
  <el-button
    id="btn"
    type="primary"
    @click="() => {
     count ++;
     ElMessage({message: `count: ${count}`, type: 'info'})
   }"
  >
    <el-icon>
      <Pointer style="margin-right: 5px;"/>
    </el-icon>
    count: {{ count }}
  </el-button>
</template>

<style lang="scss" scoped>
#btn {
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50vw;
  top: 50vh;
}
</style>