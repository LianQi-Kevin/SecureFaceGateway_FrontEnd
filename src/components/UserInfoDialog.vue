<script setup lang="ts">
import type {userInfo} from "@/types/user";
import {getUserAvatar} from "@/network/user";

const display = defineModel<boolean>('visible', {required: true, default: false});

interface PropsType {
  title?: string
  user_info: userInfo
}

const props = withDefaults(defineProps<PropsType>(), {
  title: "用户信息",
});

const user_avatar = ref<string>("");

onMounted(() => {
  getUserAvatar().then((res) => {
    user_avatar.value = res;
  }).catch((err) => {
    console.error(err)
  })
})

function cleanLogin(){
  // 清除登录信息
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_info");
  window.location.reload();
}
</script>

<template>
  <el-dialog
    :model-value="display"
    :title="props.title"
    align-center
    :destroy-on-clos="true"
    :before-close="() => {display = false}"
    style="max-width: 400px"
  >
    <div class="avatar__block">
      <el-avatar :src="user_avatar" shape="circle" :size="100" fit="cover" />
    </div>
    <el-form label-position="right" label-width="auto" v-model="props.user_info">
      <el-form-item label="用户名">
        <el-input v-model="props.user_info.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="props.user_info.user_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="权限组">
        <el-input v-model="props.user_info.role" disabled></el-input>
      </el-form-item>
      <el-form-item >
        <div style="display: flex; justify-content: center; width: 100%">
          <el-button style="width: 100%" type="danger" plain @click="cleanLogin">Log Out</el-button>
        </div>
      </el-form-item>

    </el-form>

  </el-dialog>
</template>

<style scoped lang="scss">
.avatar__block {
  margin: 0 auto 20px auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>