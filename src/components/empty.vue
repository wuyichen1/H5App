<template>
  <div class="empty-container">
    <img src="@/assets/empty.png" alt="empty" class="empty-image" />
    <div class="empty-text">NO Data</div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.empty-container {
  display: flex;
  flex-direction: column; /* 上下排列 */
  align-items: center;    /* 水平居中 */
}

.empty-image {
  width: calc(100vw * 111 / 375);
  height: calc(100vw * 111 / 375);
}

.empty-text {
  margin-top: calc(100vh * 16 / 812); /* 上下间距 */
  /* font-family: 'PlayfairDisplayRegular', sans-serif; */
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  letter-spacing: 0px;
  line-height: calc(100vw * 23.99 / 375);
  color: rgba(255, 255, 255, 0.6);
}
</style>