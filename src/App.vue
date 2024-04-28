<script setup>
import {ElMessage} from "element-plus";
import {Pointer} from "@element-plus/icons-vue";

const count = ref(0)
</script>

<template>
 <el-button
   id="btn"
   @click="() => {
     count ++;
     ElMessage({message: `count: ${count}`, type: 'info'})
   }"
   type="primary"
 >
   <el-icon><Pointer style="margin-right: 5px;"/></el-icon>
   count: {{ count }}
 </el-button>
</template>

<style scoped lang="scss">
#btn {
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50vw;
  top: 50vh;
}
</style>
