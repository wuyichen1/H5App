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
    <div class="page-container">
      <!-- top -->
      <div class="top-section">
        <BackButton />
      </div>
      <!-- center -->
      <!-- <div class="center-section">
        <div
          v-for="(item, index) in messages"
          :key="index"
          class="message-box"
          @click="handleMessageClick(item)"
        >
          <span>{{ item }}</span>
        </div>
      </div> -->
      <!-- bottom -->
      <div class="bottom-section">
        <div class="bottom-scroll">
          <div v-for="(item, index) in bottomItems" :key="index" class="chat-item">
            <div class="chat-choose" v-if="item.sendId === '0'">
              <div class="chat-time">{{ item.time }}</div>
              <div class="chat-content">
                <img class="chat-avatar" src="@/assets/aiavator.png" alt="AI Avatar" />
                <div class="chat-message">{{ item.message }}</div>
              </div>
            </div>
            <div class="chat-choose" v-else>
              <div class="chat-time">{{ item.time }}</div>
              <div class="chat-content-rigth">
                <div class="chat-message-rigth">{{ item.message }}</div>
                <div class="chat-avatar-rigth">
                  <img :src="currentUserStore.currentUser.avator" alt="AI Avatar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部输入框 -->
    <!-- bottom input box -->
    <div class="bottom-input">
      <input type="text" placeholder="Say something" v-model="chatInput" />
      <img
        class="send-icon"
        src="@/assets/commentsend.png"
        alt="Send"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BackButton from "@/components/back.vue";
import { useCurrentUserStore } from "@/stores/currentUser";
import { useUIStore } from "@/stores/ui";
import { aiChat } from "@/utils/ai";
import { decryptAES } from "@/utils/aes";

const messages = ref([
  "I'm feeling great today.",
  "Do you like reading?",
  "Can you comfort me?",
]);

const currentUserStore = useCurrentUserStore();
const uiStore = useUIStore();

const getFirstTime = () => {
  const key = "chat_first_time";
  const saved = localStorage.getItem(key);

  if (saved) return saved;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // 12:00
  localStorage.setItem(key, time);

  return time;
};

const bottomItems = ref([
  {
    sendId: "0",
    time: getFirstTime(),
    message: "Hi there! I’m Kico, your AI buddy for all things fun and creative.",
  },
]);

async function handleMessageClick(message) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  bottomItems.value.push({
    sendId: currentUserStore.currentUser.id,
    time,
    message: message,
  });

  if (uiStore.loading) return;
  uiStore.showLoading();

  try {
    const res = await aiChat(message);

    uiStore.hideLoading();

    if (res.data.code === "0000") {
      // 1 解密
      const decryptText = decryptAES(res.data.result);
      // 2 转 JSON
      const data = JSON.parse(decryptText);
      const aiMessage = data?.output?.choices?.[0]?.message?.content || "";

      // 然后 push 到聊天列表
      bottomItems.value.push({
        sendId: "0", // AI
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        message: aiMessage,
      });
    } else {
      uiStore.showToast(res.data.message);
    }
  } catch {
    uiStore.hideLoading();
    uiStore.showToast("Network error");
  }
}

const chatInput = ref("");

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  bottomItems.value.push({
    sendId: currentUserStore.currentUser.id,
    time,
    message: text,
  });

  if (uiStore.loading) return;
  uiStore.showLoading();
  try {
    const res = await aiChat(text);

    uiStore.hideLoading();

    if (res.data.code === "0000") {
      // 1 解密
      const decryptText = decryptAES(res.data.result);
      // 2 转 JSON
      const data = JSON.parse(decryptText);
      const aiMessage = data?.output?.choices?.[0]?.message?.content || "";

      // 然后 push 到聊天列表
      bottomItems.value.push({
        sendId: "0", // AI
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        message: aiMessage,
      });

      chatInput.value = "";
    } else {
      uiStore.showToast(res.data.message);
    }
  } catch {
    uiStore.hideLoading();
    uiStore.showToast("Network error");
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
  z-index: 10;
}

/* .top-card {
  width: 100%;
  height: calc(100vh * 180 / 812);
  background: linear-gradient(135deg, #F9D0FF 0%, #E7A9FF 100%);
  border-radius: calc(100vw * 20 / 375);
  padding: calc(100vh * 24 / 812) calc(100vw * 20 / 375);
  box-sizing: border-box;
  display: flex;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
} */
.top-card {
  width: 100%;
  height: 150PX;
  /* height: calc(100vh * 140 / 812); */
  background-image: url("@/assets/coinbgc.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: calc(100vw * 20 / 375);
  padding: 24PX 20PX;
  /* padding: calc(100vh * 24 / 812) calc(100vw * 20 / 375); */
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
  gap: calc(100vh * 12 / 812);
}

.card-title {
  font-family: "PangMenZhengDao", sans-serif;
  font-size: calc(100vw * 20 / 375);
  line-height: 1.2;
  color: #4a2019;
  text-align: left;
}

.card-tag {
  width: fit-content;
  background: #000;
  color: #fff;
  padding: calc(100vh * 6 / 812) calc(100vw * 16 / 375);
  border-radius: calc(100vw * 20 / 375);
  font-family: "PangMenZhengDao", sans-serif;
  font-size: calc(100vw * 14 / 375);
}

.card-image {
  position: absolute;
  right: -10PX;
  top: -43PX;
  /* right: calc(100vw * -10 / 375);
  top: calc(100vh * -40 / 812); */
  width: 170PX;
  height: 192PX;
  /* width: calc(100vw * 180 / 375);
  height: calc(100vh * 230 / 812); */
  background-image: url("@/assets/aiusermodel.png");
  background-size: contain;
  background-position: bottom center;
  background-repeat: no-repeat;
}

.top-section {
  position: relative;
  margin-top: calc(100vh * 56 / 812);
  margin-left: calc(100vw * 20 / 375);
  z-index: 100;
}

.center-section {
  position: absolute;
  /* top: 20PX; */
  top: calc(100vh * 270 / 812);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: calc(100vw * 10 / 375);
  z-index: 100;
  padding: 0 calc(100vw * 20 / 375);
  flex-wrap: wrap;
}

.message-box {
  display: flex;
  align-items: center;
  height: calc(100vh * 32 / 812);
  padding: 0 calc(100vw * 12 / 375);
  border-radius: calc(100vw * 16 / 375);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: "PangMenZhengDao", sans-serif;
  font-size: calc(100vw * 12 / 375);
  font-weight: 500;
  color: #4a2019;
  white-space: nowrap;
  cursor: pointer;
}

.bottom-section {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 300PX; /* 调低一点给标签留出空间 */
  /* top: calc(100vh * 300 / 812); */
  background: #ffffff;
  border-radius: calc(100vw * 40 / 375) calc(100vw * 40 / 375) 0 0;
  z-index: 2;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05);
}

.bottom-scroll {
  height: calc(100% - calc(100vh * 20 / 812));
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-top: calc(100vh * 20 / 812);
  padding-bottom: calc(100vh * 90 / 812);
  box-sizing: border-box;
  gap: calc(100vh * 24 / 812);
}

/* Optional: hide scrollbar */
.bottom-scroll::-webkit-scrollbar {
  display: none;
}
.bottom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.chat-item {
  display: flex;
  flex-direction: column;
}

.chat-choose {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 16 / 812);
}

.chat-time {
  text-align: center;
  font-family: "PangMenZhengDao", sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 17.41 / 375);
  letter-spacing: 0;
  color: rgba(105, 71, 65, 1);
}

.chat-content {
  display: flex;
  align-items: flex-start;
  gap: calc(100vw * 12 / 375);
  margin-left: calc(100vw * 20 / 375);
  margin-right: calc(100vw * 34 / 375);
}

.chat-content-rigth {
  display: flex;
  align-items: flex-start;
  justify-content: end;
  gap: calc(100vw * 12 / 375);
  margin-left: calc(100vw * 34 / 375);
  margin-right: calc(100vw * 20 / 375);
}

.chat-avatar {
  width: calc(100vw * 44 / 375);
  height: calc(100vw * 44 / 375);
  border-radius: 50%;
}

.chat-avatar-rigth {
  width: calc(100vw * 44 / 375);
  height: calc(100vw * 44 / 375);
  flex-shrink: 0;
  border-radius: 50%; /* fully circular */
  padding: calc(100vw * 1 / 375); /* border thickness */
  background: linear-gradient(
    135deg,
    rgba(255, 159, 142, 1) 0%,
    rgba(241, 213, 160, 1) 32.13%,
    rgba(201, 255, 221, 1) 67.84%,
    rgba(157, 255, 255, 1) 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
}

/* Ensure avatar images fit inside the circular container and any overflow is hidden */
.chat-avatar img,
.chat-avatar-rigth img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* ensure image fills container */
  border-radius: 50%;
  overflow: hidden;
}

.chat-message {
  border-radius: 0 calc(100vw * 10 / 375) calc(100vw * 10 / 375) calc(100vw * 10 / 375);
  background: rgba(255, 159, 142, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: calc(100vh * 10 / 812) calc(100vw * 10 / 375);
  font-family: "PangMenZhengDao", sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
}

.chat-message-rigth {
  border-radius: calc(100vw * 10 / 375) 0 calc(100vw * 10 / 375) calc(100vw * 10 / 375);
  background: rgba(201, 255, 221, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: calc(100vh * 10 / 812) calc(100vw * 10 / 375);
  font-family: "PangMenZhengDao", sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: rgba(105, 71, 65, 1);
}

.bottom-input {
  position: absolute;
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 20 / 375);
  bottom: calc(100vh * 29 / 812);
  height: calc(100vh * 54 / 812);
  display: flex;
  align-items: center;
  gap: calc(100vw * 10 / 375);
  background: rgba(201, 255, 221, 1);
  border-radius: calc(100vw * 40 / 375);
  backdrop-filter: blur(calc(100vw * 32 / 375));
  box-sizing: border-box;
  padding: 0 calc(100vw * 16 / 375);
  z-index: 200;
}

.bottom-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  font-family: "PangMenZhengDao", sans-serif;
  color: rgba(0, 0, 0, 1);
}

.bottom-input input::placeholder {
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  font-family: "PangMenZhengDao", sans-serif;
  color: rgba(105, 71, 65, 1);
}

.send-icon {
  width: calc(100vw * 30 / 375);
  height: calc(100vw * 30 / 375);
  cursor: pointer;
}
</style>
