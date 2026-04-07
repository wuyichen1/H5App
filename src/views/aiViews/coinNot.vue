<template>
  <div class="coninnot-container">
    <div class="coninnot-bgi"></div>
    <div class="coinnot-box">
      <div class="coinnot-bgc"></div>
      <div class="recharge-button" @click="handleRecharge">Recharge</div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['recharge'])

function handleRecharge() {
  emit('recharge', true)
}
</script>

<style scoped>
.coninnot-container {
  width: 100%;
  position: absolute;
}

.coninnot-bgi {
  position: absolute;
  top: calc(100vh * -89 / 812);
  width: 100%;
  height: calc(100vh * 401 / 812);
  background-image: url('@/assets/coinnotbgi.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
}

.coinnot-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 23 / 812);
} 

.coinnot-bgc {
  /* width: 288PX;
  height: 240PX; */
  width: calc(100vw * 288 / 375);
  height: calc(100vh * 240 / 812);
  background-image: url('@/assets/coinnot.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.recharge-button {
  width: calc(100vw * 240 / 375);
  height: calc(100vh * 59 / 812);
  border-radius: calc(100vw * 87 / 375);
  background: linear-gradient(135deg, rgb(254, 20, 204) 0%, rgb(255, 185, 0) 100%);
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  /* box-shadow: 0px calc(100vw * 2 / 375) 0px  rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375)  rgba(200, 100, 154, 1),inset 0px calc(100vw * 2 / 375) 0px  rgba(255, 255, 255, 0.8); */
  display: flex;
  justify-content: center;
  align-items: center;
  /* font-family: 'PlayfairDisplayBlack', sans-serif; */
  font-size: calc(100vw * 20 / 375);
  font-weight: 500;
  line-height: calc(100vw * 26.66 / 375);
  color: rgb(255, 255, 255);
}
</style>