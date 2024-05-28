<script setup lang="ts">
import {FormInstance, FormRules} from "element-plus";
import {getUserInfo} from "@/network/user";
import {v4 as uuid} from 'uuid';
import {leaveApplication, LeaveApplicationRequest} from "@/network/application";

const display = defineModel<boolean>('visible', {required: true, default: false});

interface props_type {
  title?: string;
}

interface leaveApplicationType extends LeaveApplicationRequest  {
  username: string,
  timeRange?: [Date, Date],
}


const emit = defineEmits<{
  (e: 'onSubmit', leaveApplicationInfo: leaveApplicationType): void;
}>();

const props = withDefaults(defineProps<props_type>(), {
  title: "创建请假申请",
});
// init timeRange
const now = new Date();
const startTime = new Date(now.getTime() + 30 * 60 * 1000); // 当前时间的半小时后
const endTime = new Date(startTime.getTime() + 12 * 60 * 60 * 1000); // start_time的12小时后

onMounted(() => {
  nextTick(() => {
    getUserInfo().then((res) => {
      console.log(res)
      Object.assign(target, res)
    });
  });
});

function getUUID(): string {
  return uuid();
}

const target = reactive<leaveApplicationType>({
  username: "",
  user_id: "",
  task_id: getUUID(),
  timeRange: [startTime, endTime],
  start_time: startTime.getTime(),
  end_time: endTime.getTime(),
  reason: "11",
});


const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<leaveApplicationType>>({
  reason: [{required: true, message: "请输入请假原因", trigger: "blur"}],
  timeRange: [{required: true, message: "请输入请假时间", trigger: "blur"}],
});

function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // update time
      if (target.timeRange) {
        target.start_time = target.timeRange[0].getTime();
        target.end_time = target.timeRange[1].getTime();
      }
      // requests
      leaveApplication(target).then((res) => {
        console.log(res)
        ElMessage.success("创建成功")
      }).catch(err => {
        console.error(err)
        ElMessage.error("创建失败")
      });

      // backend
      emit('onSubmit', target)
      display.value = false;
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
    :close-delay="3">
    <el-form
      :model="target"
      label-width="auto"
      label-position="left"
      ref="ruleFormRef"
      :rules="rules"
      status-icon
    >
      <el-form-item label="申请人" prop="username">
        <el-input v-model="target.username" disabled />
      </el-form-item>
      <el-form-item label="任务ID" prop="task_id">
        <el-input v-model="target.task_id" disabled />
      </el-form-item>
      <el-form-item label="请假时间" prop="timeRange">
        <el-date-picker
          v-model="target.timeRange"
          unlink-panels
          :default-value="[startTime, endTime]"
          type="datetimerange"
          range-separator="至"
          start-placeholder="Start Date"
          end-placeholder="End Date"
         />
      </el-form-item>
      <el-form-item label="请假原因" prop="reason">
        <el-input
          v-model="target.reason"
          type="textarea"
          placeholder="请输入请假原因"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item>
        <div class="submit_btn_area">
          <el-button @click="onSubmit(ruleFormRef)" class="crate" plain type="primary">创建</el-button>
          <el-button @click="display = false" class="cancel" plain type="info">取消</el-button>
        </div>
        <el-text type="info">创建时间：{{new Date().toUTCString()}}</el-text>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

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