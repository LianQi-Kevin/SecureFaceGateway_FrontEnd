<script setup lang="ts">

import {useDevicesList, useUserMedia, useIntervalFn} from '@vueuse/core';
import {dataURLToFile} from '@/tools/image';
import {faceFind} from "@/network/face";
import type {faceFindResponse} from "@/network/face";
import {ElMessage} from "element-plus";
import { useThrottleFn } from '@vueuse/core'

const currentCamera = ref<string>();
const {videoInputs: cameras} = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
});

const {stream, enabled} = useUserMedia({
  constraints: {video: {deviceId: currentCamera.value}},
});

const video = ref<HTMLVideoElement>();
const video_mask = ref<HTMLCanvasElement>();

const detectFace = ref<boolean>(false);

const {pause, resume} = useIntervalFn(() => {
  // 取出视频帧
  if (detectFace.value) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (video.value) {
      canvas.width = video.value.videoWidth
      canvas.height = video.value.videoHeight
      context?.drawImage(video.value, 0, 0, canvas.width, canvas.height)
      // get img_b64
      const imgData = canvas.toDataURL('image/jpeg')
      // take img_b64 to File()
      const img_name = new Date().getTime().toString() + '.jpg'
      const imgBlob = dataURLToFile(imgData, img_name)
      // send to server
      faceFind(imgBlob).then((res: faceFindResponse) => {
        console.debug(res)
        if (res.success) {
          const mask_ctx = video_mask.value?.getContext('2d')
          if (mask_ctx && video.value && video_mask.value) {
            // 设置 Canvas 大小
            video_mask.value.width = video.value.videoWidth;
            video_mask.value.height = video.value.videoHeight;

            // 绘制矩形框
            if (res.pose) {
              mask_ctx.strokeStyle = "blue";
              mask_ctx.lineWidth = 3;
              mask_ctx.strokeRect(res.pose.x, res.pose.y, res.pose.w, res.pose.h);
            }

            // 绘制文本
            if (res.username && res.pose && res.conf) {
              mask_ctx.font = "25px Arial";
              mask_ctx.fillStyle = "red";
              // 基于res.pose的位置计算文字位置
              mask_ctx.fillText(res.username, res.pose.x, res.pose.y - 30); // username
              // 控制conf最多3位小数
              const conf = `${(res.conf * 100).toFixed(3)} %`
              mask_ctx.fillText(conf, res.pose.x, res.pose.y - 5); // confidence
            }

          }
        } else {
          // 清理canvas的内容
          const mask_ctx = video_mask.value?.getContext('2d')
          if (mask_ctx && video.value && video_mask.value) {
            mask_ctx.clearRect(0, 0, video_mask.value.width, video_mask.value.height);
          }
        }
      }).catch((err) => {
        console.error(err)
        throttledFn()
      })
    }
  }
}, 500);

const throttledFn = useThrottleFn(() => {
  ElMessage.error("人脸识别失败，请检查网络")
}, 3000)

// 监听detectFace, 变更时启停定时器
watch(detectFace, (value) => {
  if (value) {
    resume() // 开启定时器

  } else {
    pause() // 暂停定时器
  }
});

// 监听是否切换摄像头
watch(stream, (value) => {
  if (value && video.value) {
    video.value.srcObject = value
  }
});


// 进入页面开启摄像头
onMounted(() => {
  enabled.value = true;
  detectFace.value = true;
});

// 离开页面关闭摄像头
onUnmounted(() => {
  enabled.value = false;
  detectFace.value = false;
});
</script>

<template>
  <div class="content">
    <div class="detect__card">
      <div class="video__block">
        <video ref="video" autoplay muted class="video" v-if="enabled"/>
        <canvas ref="video_mask" class="video_mask" v-if="enabled"/>
        <el-empty v-else description="请启用摄像头" class="video" />
      </div>
      <div class="control__block">
        <el-button @click="() => {enabled = !enabled}" plain type="primary" class="enabled__button">
          {{ enabled ? 'Stop Camera' : 'Start Camera' }}
        </el-button>
        <el-select
          v-model="currentCamera"
          placeholder="请选择摄像头"
          size="default"
          class="camera__select"
        >
          <el-option
            v-for="camera of cameras"
            :key="camera.deviceId"
            :value="camera.deviceId"
            :label="camera.label"
          />
        </el-select>
      </div>
      <div class="detect_control">
        <el-button class="detect__button" type="primary" size="large" @click="detectFace = !detectFace" plain>
          {{ detectFace ? 'Stop Detect' : 'Start Detect'}}
        </el-button>


      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  min-width: 200px;
  max-width: 600px;
  max-height: 80vh;
  margin: 0 auto;

  .detect__card {
    height: 100%;
    box-shadow: var(--el-box-shadow-dark);
    margin: 20px;
    padding: 25px 10px 10px 10px;

    display: flex;
    flex-direction: column;
    justify-items: center;

    .video__block {
      height: 100%;
      position: relative;
      .video {
        min-width: 200px;
        max-width: 100%;
      }

      .video_mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
      }
    }

    .control__block {
      margin: 10px 0;
      width: 100%;

      display: flex;
      flex-direction: row;
      gap: 10px;

      .enabled__button {
        flex-basis: 30%;
        flex-grow: 1;
      }

      .camera__select {
        flex-basis: 70%;
        flex-grow: 1;
      }
    }
    .detect__button {
      width: 100%;
    }
  }
}
</style>