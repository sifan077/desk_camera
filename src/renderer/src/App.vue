<template>
  <div>
    <video ref="video" autoplay></video>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

onMounted(() => {
  startCamera()
})

const video = ref(null)

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (video.value) {
      video.value.srcObject = stream
    }
  } catch (err) {
    console.error('Error accessing camera: ', err)
  }
}
</script>

<style scoped>
video {
  background: transparent;
  width: 260px;
  height: 260px;
  border-radius: 50%; /* 使视频显示为圆形 */
  object-fit: cover; /* 确保视频内容适应容器 */
}
</style>
