<script setup lang="ts">
import {getAccessToken} from "@/network/token";
import type {FormInstance, FormRules} from "element-plus";
import {getUserInfo} from "@/network/user";
import {useStorage} from "@vueuse/core";
import type {login_form, userInfo} from "@/types/user";

const loggedIn = inject<boolean>("loggedIn");
const changeLogin = ref<boolean>(false);
const display = defineModel<boolean>('visible', {required: true, default: false});

interface PropsType {
  title?: string
  submitCallable?: () => void;
}

const props = withDefaults(defineProps<PropsType>(), {
  title: "登录",
});

const login_form = reactive<login_form>({
  username: "",
  password: "",
});

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<login_form>>({
  username: [{required: true, message: "请输入用户名", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
});

async function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return // 非空
  await formEl.validate((valid) => {
    if (valid) {
      // 获取access_token
      getAccessToken(login_form.username, login_form.password).then(() => {
        ElMessage.success("登录成功");
        // 获取用户信息
        getUserInfo().then((res: userInfo) => {
          console.log(res)
          useStorage("user_info", res)
        }).catch(err => {
          console.error(err)
          ElMessage.error("获取用户信息失败")
        })

        // 关闭登录框
        display.value = false;
        changeLogin.value = false;
        // 提交回调
        if (props.submitCallable) {
          props.submitCallable();
        }
      }).catch(err => {
        console.log(err);
        ElMessage.error("登录失败, 请检查用户名和密码");
      });
    }
  });


  if (props.submitCallable) {
    props.submitCallable();
  }
}

</script>

<template>
  <el-dialog
    :before-close="() => {display = false}"
    :model-value="display"
    :title="props.title"
    align-center
    :destroy-on-clos="true"
    :close-delay="3"
    class="dialog"
  >
    <el-form
      ref="ruleFormRef"
      :model="login_form"
      :rules="rules"
      label-position="left"
      label-width="auto"
      status-icon
      v-if="!loggedIn || changeLogin"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="login_form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="login_form.password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item>
        <div class="submit_btn_area">
          <el-button @click="onSubmit(ruleFormRef)" class="login" plain type="primary">登录</el-button>
          <el-button @click="display = false" class="cancel" plain type="info">取消</el-button>
        </div>
        <el-text type="info">注册功能暂未开放, 请联系管理员添加账号</el-text>
      </el-form-item>
    </el-form>
    <el-result v-else status="success" title="已登录" :icon="'success'">
      <template #extra>
        <el-button type="primary" plain @click="() => {changeLogin = true}">修改登陆信息</el-button>
      </template>
    </el-result>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog {
  max-width: 200px;
}

.submit_btn_area{
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
  .login {
    flex-grow: 1;
  }
  .cancel {
    flex-grow: 1;
  }
}
</style>