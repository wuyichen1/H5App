<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
      <span class="edit-title">MY DIAMONDS</span>
    </div>

    <!-- 渐变金币总览 -->
    <div class="coin-banner">
      <div class="coin-banner-inner">
        <img class="coin-banner-icon" src="@/assets/coin.png" alt="coin" />
        <div class="coin-banner-text">
          <div class="coin-banner-number">{{ currentUserStore.currentUser?.coins ?? 0 }}</div>
          <div class="coin-banner-label">My Diamonds</div>
        </div>
      </div>
    </div>

    <!-- 支付选项网格 -->
    <div class="coins">
      <div class="coins-grid">
        <div
          v-for="(item, index) in otherStore.other.coinsSetting"
          :key="item.key ?? index"
          class="coin-card"
          :class="{ 'coin-card-selected': selectedIndex === index }"
          @click="() => { selectedIndex = index }"
        >
          <div class="coin-card-row">
            <img class="coin-card-icon" src="@/assets/coin.png" alt="coin" />
            <div class="coin-card-count">{{ item.cions }}</div>
          </div>
          <div class="coin-card-price">{{ item.money }}$</div>
        </div>
      </div>
    </div>

    <div class="recharge-wrap">
      <button class="recharge-btn" type="button" @click="handleRecharge">recharge</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/back.vue'
import { useOtherStore } from '@/stores/other'
import { useCurrentUserStore } from '@/stores/currentUser'
import { sendPaymentToIOS } from '@/utils/iosBridge'

defineOptions({ name: 'PayCoins' })

const otherStore = useOtherStore()
const currentUserStore = useCurrentUserStore()

const selectedIndex = ref(-1)

function handleCoinClick(item) {
  // `key` 用作 iOS 内购标识
  sendPaymentToIOS(item.key)
}

function handleRecharge() {
  if (selectedIndex.value < 0) return
  const selectedItem = otherStore.other.coinsSetting?.[selectedIndex.value]
  if (!selectedItem) return
  handleCoinClick(selectedItem)
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: calc(100vh * 58 / 812) calc(100vw * 20 / 375) 0;
}

.edit-title {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 20PX;
  font-weight: 900;
  font-style: italic;
  background: #000;
  -webkit-background-clip: text; /* 仅对文本裁剪背景 */
  -webkit-text-fill-color: transparent; /* 文字透明，让背景显示 */
  background-clip: text; /* 标准属性，兼容非 webkit 浏览器 */
}

.coin-banner {
  width: calc(100vw * 335 / 375);
  height: calc(100vh * 106 / 812);
  margin: calc(100vh * 24 / 812) auto 0;
  background-image: url('@/assets/coinbgc.png');
  background-size: cover;
  background-position: center;
  border-radius: calc(100vw * 24 / 375);
}

.coin-banner-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
  padding: 0 calc(100vw * 24 / 375) 0 calc(100vw * 16 / 375);
  box-sizing: border-box;
}

.coin-banner-icon {
  width: calc(100vw * 90 / 375);
  height: calc(100vw * 90 / 375);
  object-fit: cover;
  display: block;
  padding: 0 20PX 0 0;
}

.coin-banner-text {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 6 / 812);
}

.coin-banner-label {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 13PX;
  font-weight: 400;
  line-height: calc(100vw * 16.96 / 375);
  color: rgba(255, 255, 255, 0.82);
}

.coin-banner-number {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 24PX;
  font-weight: 700;
  font-style: italic;
  line-height: calc(100vw * 29.44 / 375);
  color: #fff;
}

.coins {
  flex: 1;
  margin-top: calc(100vh * 26 / 812);
  padding: 0 calc(100vw * 20 / 375) calc(100vh * 12 / 812);
  overflow-y: auto;
  box-sizing: border-box;
}

.coins-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: calc(100vh * 12 / 812) calc(100vw * 14 / 375);
  align-items: stretch;
}

.coin-card {
  height: calc(100vh * 84 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375) rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(100vh * 8 / 812);
}

.coin-card-row {
  display: flex;
  align-items: center;
  gap: calc(100vw * 5 / 375);
}

.coin-card-icon {
  width: calc(100vw * 26 / 375);
  height: calc(100vw * 26 / 375);
  object-fit: cover;
  display: block;
}

.coin-card-count {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 17PX;
  font-weight: 600;
  line-height: calc(100vw * 18.96 / 375);
  color: rgba(0, 0, 0, 0.92);
}

.coin-card-price {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 13PX;
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  color: rgba(0, 0, 0, 1);
}

.coin-card-selected {
  background: rgba(176, 224, 252, 0.2);
  /* background: linear-gradient(135deg, rgba(250, 180, 150, 1) 0%, rgba(251, 226, 100, 1) 100%); */
  border: 2PX solid rgba(176, 224, 252, 1);
}

.coin-card-selected .coin-card-count {
  color: #000;
}

.coin-card-selected .coin-card-price {
  color: rgba(0, 0, 0, 0.92);
}

.recharge-wrap {
  width: 100%;
  padding: 0 calc(100vw * 20 / 375) calc(100vh * 34 / 812);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.recharge-btn {
  width: 240PX;
  height: 58PX;
  border: none;
  /* border-radius: calc(100vw * 26 / 375); */
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 18PX;
  font-weight: 800;
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
  text-transform: uppercase;
  background-image: url('@/assets/buttonbg.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>