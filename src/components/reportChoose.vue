<template>
  <div class="dialog-mask" @click.self="$emit('close')">
    <div class="dialog-container" :style="{ backgroundImage: `url(${bgcImage})` }">
      <div class="dialog-content">
        <div
          class="dialog-options"
          :style="{ backgroundImage: `url(${optionsBgImage})` }"
        >
          <div class="option" @click="$emit('select', 0)">Report</div>
          <div class="option" @click="$emit('select', 1)">Shield</div>
        </div>
        <div class="cancel" @click.self="$emit('close')">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import bgcImage from "@/assets/reportdialogbgc.png";
import optionsBgImage from "@/assets/reportchoosebgc.png";
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog-container {
  position: fixed;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%); /* 居中 */
  width: 330PX;
  height: 410PX;
  margin-left: 10PX;
  /* width: calc(100vw * 313 / 375);
  height: calc(100vh * 440 / 812);
  margin-left: calc(100vw * 14 / 375); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1000;
  display: flex;
  justify-self: flex-end;
  flex-direction: column;
  gap: 26PX; /* 上下间距26 */
  /* gap: calc(100vh * 26 / 812);  */
}

.dialog-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 底部对齐 */
  align-items: center; /* 水平居中 */
  height: 100%;
  width: auto;

  margin-right: 28PX;
  padding-bottom: 36PX; /* 底部间距 */
  gap: 26PX; /* 上下间距26 */
  /* margin-right: calc(100vw * 28 / 375);
  padding-bottom: calc(100vh * 36 / 812);
  gap: calc(100vh * 26 / 812); */
}

.dialog-options {
  width: 220PX;
  height: 164PX;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 26PX; /* 上下间距26 */
  align-items: center;
  background-image: url(""); /* 先空，实际绑定在模板 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.option {
  width: 148PX;
  height: 46PX;
  border-radius: 40PX;
  /* width: calc(100vw * 148 / 375);
  height: calc(100vh * 46 / 812);
  border-radius: calc(100vw * 40 / 375); */
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375) rgba(0, 0, 0, 0.1);
  font-family: "PangMenZhengDao", sans-serif;
  font-size: 16PX;
  font-weight: 400;
  color: rgba(74, 32, 25, 1);
  text-align: center;

  display: flex; /* 新增 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.cancel {
  width: 164PX;
  height: 56PX;
  border-radius: 40PX;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: inset calc(100vw * -1 / 375) calc(100vw * -1 / 375) calc(100vw * 1 / 375)
      rgba(255, 255, 255, 0.6),
    inset calc(100vw * 1 / 375) calc(100vw * 1 / 375) calc(100vw * 1 / 375)
      rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(calc(100vw * 10 / 375));
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "PangMenZhengDao", sans-serif;
  font-size: 19PX;
  font-weight: 400;
  color: rgba(74, 32, 25, 1);
  text-align: center;
}
</style>
