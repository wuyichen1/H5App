<template>
  <div class="page">
    <!-- 顶部的机器人形象和卡片 -->
    <div class="top-card-container">
      <div class="top-card">
        <div class="card-left">
          <div class="card-title">Intelligent AI, cosplay costume analysis</div>
          <div class="card-tag">Welcome to</div>
        </div>
        <div class="card-image"></div>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="page-content">
      <div class="top-section">
        <BackButton />
      </div>
      <div class="bottom-section">
        <div class="bottom-container">
          <div class="bottom-title">Seicos AI</div>
          <div class="bottom-text">
            Hello everyone! I'm Seicos AI, a passionate cosplay buddy, and together we'll
            explore the world of costumes, characters, and creativity. Whether you're
            passionate about creating beautiful costumes, cosplaying your favorite heroes,
            or exploring new techniques, I'll share my insights here to inspire your
            designs and make your cosplay journey fun and fulfilling. Ready to bring your
            favorite characters to life and unleash your creativity? Let's immerse
            ourselves in the world of cosplay and create unforgettable experiences every
            day!
          </div>
          <!-- 购买 -->
          <div class="purchase-container" @click="handlePurchaseClick">
            <div class="purchase-info">
              <div class="purchase-icon"></div>
              <div class="purchase-count">100</div>
            </div>
            <div class="chat-box">Chat</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="showCoinNot" @click.self="showCoinNot = false">
      <CoinNotDialog @recharge="handleRechargeEvent" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCurrentUserStore } from "@/stores/currentUser";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import BackButton from "@/components/back.vue";
import CoinNotDialog from "@/views/aiViews/coinNot.vue";

const showCoinNot = ref(false);

const currentUserStore = useCurrentUserStore();
const uiStore = useUIStore();
const userStore = useUserStore();
function handlePurchaseClick() {
  if (currentUserStore.currentUser.coins >= 100) {
    if (uiStore.loading) return;
    uiStore.showLoading();

    const currentCoins = currentUserStore.currentUser.coins - 100;
    userStore.updateUser(currentUserStore.currentUser.userId, { coins: currentCoins });

    const delay = Math.floor(Math.random() * 1500) + 500;

    setTimeout(() => {
      uiStore.hideLoading();
      router.push({ name: "aiChat" });
    }, delay);
  } else {
    showCoinNot.value = true;
  }
}

const router = useRouter();
function handleRechargeEvent(value) {
  showCoinNot.value = false;
  if (value === true) {
    router.push({ name: "coins" });
  }
}
</script>

<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* prevent scrolling */
  background: linear-gradient(180deg, #f6e6ff 0%, #ffffff 100%);
}

.top-card-container {
  position: absolute;
  top: 120PX;
  left: 20PX;
  right: 20PX;
  /* top: calc(100vh * 120 / 812);
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 20 / 375); */
  z-index: 10;
}

.top-card {
  width: 100%;
  height: 150PX;
  background-image: url("@/assets/coinbgc.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 20PX;
  padding: 24PX 20PX;
  box-sizing: border-box;
  display: flex;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.card-left {
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12PX;
}

.card-title {
  font-family: "PangMenZhengDao", sans-serif;
  font-size: 22PX;
  line-height: 1.2;
  color: #4a2019;
  text-align: left;
}

.card-tag {
  width: fit-content;
  background: #000;
  color: #fff;
  /* padding: 6PX 16PX; */
  padding: calc(100vh * 6 / 812) calc(100vw * 16 / 375);
  border-radius: 20PX;
  font-family: "PangMenZhengDao", sans-serif;
  font-size: 14PX;
}

.card-image {
  position: absolute;
  right: 0PX;
  top: -40PX;
  width: 146PX;
  height: 186PX;
  background-image: url("@/assets/aiusermodel.png");
  background-size: contain;
  background-position: bottom center;
  background-repeat: no-repeat;
}

.page-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto; /* 让除返回按钮外的内容可滚动 */
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.top-section {
  margin-top: 56PX;
  margin-left: 20PX;
  z-index: 100;
  position: sticky; /* 滚动时返回按钮保持可见 */
  top: 56PX;
}

.bottom-section {
  display: flex;
  justify-content: flex-start;
  z-index: 99;
  margin-top: 200PX;
  flex: 1; /* 撑满剩余高度 */
}

.bottom-container {
  width: 100%;
  background: #ffffff;
  border-radius: 40PX 40PX 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 26PX 20PX 20PX;
  box-sizing: border-box;
  flex: 1; /* 让内部卡片也随高度拉伸 */
  min-height: 0; /* 防止 flex 子项溢出导致撑不开 */
  box-shadow: 0 -10px 0px rgba(0, 0, 0, 0.05);
}

.bottom-title {
  font-family: "PangMenZhengDao", sans-serif;
  font-size: 30PX;
  font-weight: 400;
  color: #27244F;
  text-align: center;
  margin-bottom: 20PX;
}

.bottom-text {
  font-family: "PangMenZhengDao", sans-serif;
  font-size: 16PX;
  font-weight: 400;
  line-height: 1.6;
  color: #27244F;
  text-align: center;
  margin-bottom: 40PX;
}

.purchase-container {
  width: 335PX;
  height: 80PX;
  border-radius: 40PX;
  background: linear-gradient(90deg, #a18dff 0%, #e2a1ff 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20PX;
  box-sizing: border-box;
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: 12PX;
}

.purchase-icon {
  width: 32PX;
  height: 32PX;
  background-image: url("@/assets/coin.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.purchase-count {
  font-family: "PangMenZhengDao", sans-serif;
  font-size: 24PX;
  font-weight: 600;
  color: #ffffff;
}

.chat-box {
  width: 100PX;
  height: 48PX;
  border-radius: 24PX;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "PangMenZhengDao", sans-serif;
  font-size: 18PX;
  font-weight: 600;
  color: #a18dff;
  box-sizing: border-box;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
