<template>
  <div class="dialog-mask" @click.self="$emit('close')">
    <div class="dialog-container">
      <div class="dialog-content">
        <div class="dialog-options">
          <div class="option" @click="$emit('select', 0)">REPORT</div>
          <div class="option" @click="$emit('select', 1)">SHIELD</div>
        </div>
        <div class="cancel" @click.self="$emit('close')">CANCEL</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import bgcImage from '@/assets/reportdialogbgc.png'
// import optionsBgImage from '@/assets/reportchoosebgc.png'
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  /* display: flex;
  justify-content: center;
  align-items: center; */
  z-index: 999;
}

.dialog-container {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%); /* 居中 */
  width: 100%;
  /* height: calc(100vh * 267 / 812); */
  /* margin-left: calc(100vw * 14 / 375); */
  /* background-size: cover;
  background-position: center;
  background-repeat: no-repeat; */
  border-radius: calc(100vw * 40 / 375) calc(100vw * 40 / 375) 0px 0px;
  background: rgba(245, 245, 245, 1);
  z-index: 1000;
  display: flex;
  justify-self: flex-end;
  flex-direction: column;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 底部对齐 */
  align-items: center;       /* 水平居中 */
  /* height: 100%; */
  /* width: auto; */
  /* margin-right: calc(100vw * 28 / 375); */
  padding-bottom: calc(100vh * 55 / 812); /* 底部间距 */
  gap: calc(100vh * 22 / 812); /* 上下间距26 */
}

.dialog-options {
  /* width: calc(100vw * 260 / 375);
  height: calc(100vh * 164 / 812); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: calc(100vh * 16 / 812); /* 上下间距26 */
  margin-top: calc(100vh * 34 / 812);
  align-items: center;
}

.option {
  width: 240PX;
  height: 48PX;
  border-radius: 60PX;
  background: rgba(252, 177, 177, 0.4);
  border: 2PX solid rgba(252, 177, 177, 1);
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 16PX;
  font-weight: 500;
  color: #fff;
  text-align: center;
  /* 蓝色描边 */
  text-shadow:
    -2px -2px 0 rgba(255, 128, 128, 1),
     2px -2px 0 rgba(255, 128, 128, 1),
    -2px  2px 0 rgba(255, 128, 128, 1),
     2px  2px 0 rgba(255, 128, 128, 1),
     0px  2px 0 rgba(255, 128, 128, 1),
     0px -2px 0 rgba(255, 128, 128, 1),
     2px 0px 0 rgba(255, 128, 128, 1),
    -2px 0px 0 rgba(255, 128, 128, 1);
  text-align: center;

  display: flex; /* 新增 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.cancel {
  width: 260PX;
  height: 56PX;
  border-radius: 87PX;
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: 18PX;
  font-weight: 600;
  color: #fff;
  text-align: center;
  /* 蓝色描边 */
  text-shadow:
    -2px -2px 0 rgba(19, 106, 161, 1),
     2px -2px 0 rgba(19, 106, 161, 1),
    -2px  2px 0 rgba(19, 106, 161, 1),
     2px  2px 0 rgba(19, 106, 161, 1),
     0px  2px 0 rgba(19, 106, 161, 1),
     0px -2px 0 rgba(19, 106, 161, 1),
     2px 0px 0 rgba(19, 106, 161, 1),
    -2px 0px 0 rgba(19, 106, 161, 1);
  /* background: linear-gradient(135deg, rgb(254, 20, 204) 0%, rgb(255, 185, 0) 100%); */
  /* box-shadow: 0px calc(100vw * 2 / 375) 0px  rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375)  rgba(200, 100, 154, 1),inset 0px calc(100vw * 2 / 375) 0px  rgba(255, 255, 255, 0.8); */
  background-image: url('@/assets/buttonbg.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>