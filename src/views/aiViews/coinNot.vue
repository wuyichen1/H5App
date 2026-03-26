<template>
  <div class="coinnot-box">
    <div class="recharge-button" @click="handleRecharge">Recharge</div>
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
.coinnot-box {
  /* width: calc(100vw * 330 / 375);
  height: calc(100vh * 410 / 812);
  margin-left: calc(100vw * 26.5 / 375); */
  width: 330PX;
  height: 410PX;
  margin-left: 26.5PX;
  background-image: url('@/assets/coinnot.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.recharge-button {
  position: absolute;
  bottom: 34PX;
  /* bottom: calc(100vh * 34 / 812); */
  left: 46%;
  transform: translateX(-50%);
  width: 164PX;
  height: 56PX;
  /* width: calc(100vw * 164 / 375);
  height: calc(100vh * 56 / 812); */
  /* border-radius: calc(100vw * 40 / 375); */
  border-radius: 40PX;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: inset calc(100vw * 1 / 375) calc(100vw * 1 / 375) calc(100vw * 1 / 375) rgba(255, 255, 255, 0.6), inset calc(100vw * 1 / 375) calc(100vw * 1 / 375) calc(100vw * 1 / 375) rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'PangMenZhengDao', sans-serif;
  /* font-size: calc(100vw * 20 / 375); */
  font-size: 20PX;
  font-weight: 400;
  /* line-height: calc(100vw * 23.1 / 375); */
  
  letter-spacing: 0;
  color: rgba(74, 32, 25, 1);
}
</style>