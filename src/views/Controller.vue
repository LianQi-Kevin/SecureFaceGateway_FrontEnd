<script setup lang="ts">
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  nextTick(() => {
    if (route.path === "/controller") {
      router.push("/controller/user")
    }
  })
})
</script>

<template>
  <div class="content">
    <el-menu default-active="/controller/user" router class="leftSlider">
      <el-menu-item index="/controller/user" >用户管理</el-menu-item>
      <el-menu-item index="/controller/approval">审批中心</el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
}

</style>