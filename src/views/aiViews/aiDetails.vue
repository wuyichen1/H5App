<template>
  <div class="page">
    <!-- <div class="aiusermodel"></div>
    <div class="aichatmodel"></div> -->

    <!-- 页面内容 -->
    <div class="page-content">
      <div class="ai-user-container"></div>
      <div class="top-section">
        <BackButton />
      </div>
      <div class="bottom-scroll">
        <div class="bottom-first">
          <div class="ai-bgc-icon"></div>
          <div class="ai-title-inter">
            <div class="ai-title-inter-one">
              Hi! In Zelop
            </div>
            <div class="ai-title-inter-two">
              Discover more dazzling makeup looks and your beauty transformation plan. I'm here to assist you!
            </div>
          </div>
        </div>
        <div class="bottom-section">
          <div class="bottom-container">
            <div class="bottom-top">
              <!-- <div class="bottom-title">Zelop AI</div> -->
              <div class="bottom-text">Hi! I'm Zelop, your personal makeup buddy on this app. Looking for a certain beauty style? Want tricks to level up your routine? Or just want to discover new ideas? Let me know, and I'll point you in the right direction!</div>
            </div>
          <!-- 购买 -->
          <div class="purchase-container" @click="handlePurchaseClick">
            <div class="purchase-info">
              <div class="purchase-icon"></div>
              <div class="purchase-count">x 200</div>
            </div>
            <div class="chat-box">Chat</div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="dialog"
      v-if="showCoinNot"
      @click.self="showCoinNot = false"
    >
      <CoinNotDialog @recharge="handleRechargeEvent" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import BackButton from '@/components/back.vue'
import CoinNotDialog from '@/views/aiViews/coinNot.vue'
import { sendShowLoadingToIOS } from '@/utils/iosBridge'

const showCoinNot = ref(false)

const currentUserStore = useCurrentUserStore()
const userStore =  useUserStore()
function handlePurchaseClick() {
  if (currentUserStore.currentUser.coins >= 100) {
    sendShowLoadingToIOS(true)

    const currentCoins = currentUserStore.currentUser.coins - 100
    userStore.updateUser(currentUserStore.currentUser.userId, { coins: currentCoins })

    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      sendShowLoadingToIOS(false)
      router.push({ name: 'aiChat' })
    }, delay)
  } else {
    showCoinNot.value = true
  }
}

const router = useRouter()
function handleRechargeEvent(value) {
  showCoinNot.value = false
  if (value === true) {
    router.push({ name: 'coins' })
  }
}
</script>

<style scoped>
.page {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
}

.page-content {
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  box-sizing: border-box;
}

.top-section {
  margin-top: calc(100vh * 56 / 812);
  margin-left: calc(100vw * 20 / 375);
  z-index: 100;
}

.bottom-scroll {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bottom-first {
  position: relative;
  margin: calc(100vh * 71 / 812) calc(100vw * 20 / 375) calc(100vh * 37 / 812);
  height: calc(100vh * 143 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%);
  border: calc(100vw * 2 / 375) solid rgba(251, 226, 100, 1);
}

.ai-user-container {
  position: absolute;
  left: calc(100vw * 48 / 375);
  top: calc(100vh * 48 / 812);
  width: calc(100vw * 158 / 375);
  height: calc(100vh * 202 / 812);
  background-image: url('@/assets/aiuserpic.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  z-index: 2;
}

.ai-bgc-icon {
  position: absolute;
  right: calc(100vw * 2 / 375);
  top: calc(100vh * -12 / 812);
  width: calc(100vw * 66 / 375);
  height: calc(100vh * 66 / 812);
  background-image: url('@/assets/aibgcicon.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  z-index: 2;
}

.ai-title-inter {
  position: absolute;
  bottom: calc(100vh * 13 / 812);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: calc(100vh * 14 / 812);
  padding: 0 calc(100vw * 22 / 375);
  z-index: 3;
}

.ai-title-inter-one {
  padding-right: calc(100vw * 7 / 375);
  font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 400;
  line-height: calc(100vw * 21.2 / 375);
  color: rgba(255, 255, 255, 1);
}

.ai-title-inter-two {
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 12 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.83 / 375);
  color: rgba(255, 255, 255, 1);
}

.bottom-section {
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: flex-start;
  z-index: 99;
}

.bottom-container { 
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 85 / 812);
  box-sizing: border-box;
}

.bottom-top {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 calc(100vw * 30 / 375);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px calc(100vw * 10 / 375)  rgba(0, 0, 0, 0.06);
  padding: calc(100vh * 10 / 812) calc(100vw * 10 / 375);
}
/* 
.bottom-title {
  font-family: 'SourceHanSansBold', sans-serif;
  font-size: calc(100vw * 25 / 375);
  font-weight: 700;
  line-height: calc(100vw * 36.2 / 375);
  letter-spacing: 0;
  color: rgb(255, 255, 255);
  text-align: center;
} */

.bottom-text {
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 400;
  line-height: calc(100vw * 30 / 375);
  letter-spacing: 0;
  color: rgba(94, 69, 58, 1);
  text-align: center;
  overflow-y: auto;
}

.purchase-container {
  margin-bottom: calc(100vh * 34 / 812);
  width: calc(100vw * 240 / 375);
  height: calc(100vh * 59 / 812);
  border-radius: calc(100vw * 87 / 375);
  background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%);
  box-shadow: 0px calc(100vw * 2 / 375) 0px  rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375)  rgba(200, 100, 154, 1),inset 0px calc(100vw * 2 / 375) 0px  rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(100vw * 18 / 375);
  box-sizing: border-box;
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: calc(100vw * 3 / 375);
}

.purchase-icon {
  width: calc(100vw * 38 / 375);
  height: calc(100vh * 37 / 812);
  background-image: url('@/assets/coin.png'); /* replace with your local image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.purchase-count {
  font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 400;
  line-height: calc(100vw * 21.2 / 375);
  letter-spacing: 0;
  color: rgb(255, 255, 255);
}

.chat-box {
  /* width: calc(100vw * 73 / 375);
  height: calc(100vh * 38 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(74, 32, 25, 1);
  display: flex;
  justify-content: center;
  align-items: center; */
  font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 16.96 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>