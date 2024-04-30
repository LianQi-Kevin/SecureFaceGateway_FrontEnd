<script setup lang="ts">
import type {dataFrameRow} from "@/types/user";
import {FormInstance, FormRules, UploadRequestOptions} from "element-plus";
import {Plus} from "@element-plus/icons-vue";

interface propsType {
  title?: string,
  submitCallable?: () => void,
}

interface create_row extends dataFrameRow{
  password: string,
  face_image: File,
}

export type OmitedCreateRow = Omit<create_row, "user_id" | "id" | "disabled">;

const target = reactive<OmitedCreateRow>({
  username: "",
  password: "",
  role: "user",
  avatar: "",
  face_image: new File([], "face_image.jpg"),
});

const display = defineModel<boolean>('visible', {required: true, default: false});
const emit = defineEmits<{
  (e: 'onSubmit', userInfo: OmitedCreateRow): void;
}>();

const props = withDefaults(defineProps<propsType>(), {
  title: "创建账号",
});

const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<OmitedCreateRow>>({
  username: [{required: true, message: "请输入用户名", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
  avatar: [{required: true, trigger: "blur"}],
});

function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // console.log(target);

      emit('onSubmit', target)

      display.value = false;
    }
  });
}

function uploadRequests(options: UploadRequestOptions): Promise<File> {
  return new Promise((resolve, reject) => {
    const file = options.file as File;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      target.avatar = reader.result as string;
      target.face_image = file;
      resolve(file);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
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
    <el-form
      label-width="auto"
      label-position="left"
      :model="target"
      ref="ruleFormRef"
      :rules="rules"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="target.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="target.password" placeholder="请输入密码" show-password/>
      </el-form-item>
      <el-form-item label="Face-Image" prop="avatar">
        <el-image :src="target.avatar" style="width: 50px; height: 50px; border-radius: 50%" v-if="target.avatar !== ''"/>
        <el-upload
          v-else
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :http-request="uploadRequests"
          :limit="1"
        >
          <el-image v-if="target.avatar" :src="target.avatar" class="avatar"  alt=""
                    style="max-width: 130px; max-height: 130px" fit="cover"/>
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="权限组">
        <el-select v-model="target.role" placeholder="请选择权限组">
          <el-option label="管理员" value="admin" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="submit_btn_area">
          <el-button @click="onSubmit(ruleFormRef)" class="crate" plain type="primary">创建</el-button>
          <el-button @click="display = false" class="cancel" plain type="info">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  text-align: center;
}
</style>

<style scoped lang="scss">
.submit_btn_area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .crate {
    flex-grow: 1;
  }

  .cancel {
    flex-grow: 1;
  }
}
</style>