<script setup lang="ts">
import {FormInstance, FormRules} from "element-plus";
import {updatePassword} from "@/network/user";
import type {userInfo} from "@/types/user";

const display = defineModel<boolean>('visible', {required: true, default: false});
const emit = defineEmits<{ (e: 'onSubmit', userInfo: userInfo): void; }>();

interface PropsType {
  title?: string;
  userID: string;
  submitCallable?: () => void;
}

const props = withDefaults(defineProps<PropsType>(), {
  title: "修改密码",
});

interface passwordChangeFormTypes {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const passwordChangeForm = reactive<passwordChangeFormTypes>({
  old_password: "",
  new_password: "",
  confirm_password: "",
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<passwordChangeFormTypes>>({
  old_password: [{required: true, message: "请输入旧密码", trigger: "blur"}],
  new_password: [{
    required: true,
    validator(role, value, callback) {validateNewPassword(role, value, callback); },
    trigger: "blur"
  }],
  confirm_password: [{
    required: true,
    validator(role, value, callback) {validateConfirmPassword(role, value, callback); },
    trigger: "blur"
  }],
});

const validateNewPassword = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value.length < 8) {
    callback(new Error('密码长度不能小于8位'))
  } else if (value !== passwordChangeForm.old_password){
    callback(new Error('新密码不能与旧密码相同'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请重复输入新密码'))
  } else if (value !== passwordChangeForm.new_password) {
    callback(new Error("两次输入的密码输入不匹配!"))
  } else {
    callback()
  }
}

function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return // 非空
  formEl.validate((valid) => {
    if (valid) {
      updatePassword(props.userID, passwordChangeForm.old_password, passwordChangeForm.new_password).then((res: userInfo) => {
        display.value = false;
        emit('onSubmit', res);
      }).catch((e) => {
        ElMessage.error("密码修改失败")
        console.error(e);
      });
    }
  });
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
  >
    <el-form :model="passwordChangeForm" :rules="rules" ref="ruleFormRef" label-width="auto" status-icon>
      <el-form-item label="旧密码" prop="old_password">
        <el-input v-model="passwordChangeForm.old_password" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="passwordChangeForm.new_password" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password">
        <el-input v-model="passwordChangeForm.confirm_password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <div class="submit_btn_area">
          <el-button type="primary" @click="onSubmit(ruleFormRef)" class="submit">提交</el-button>
          <el-button @click="display = false" class="cancel" plain type="info">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss">
.submit_btn_area{
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
  .submit {
    flex-grow: 1;
  }
  .cancel {
    flex-grow: 1;
  }
}
</style>