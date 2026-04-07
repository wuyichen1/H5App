<template>
  <div class="page">
    <!-- <div class="aiusermodel"></div>
    <div class="aichatmodel"></div> -->
    <div class="page-container">
      <!-- top -->
      <div class="top-bgc">
        <div class="top-section">
          <BackButton />
          <p>Zelop AI</p>
        </div>
        <div class="top-ai-out-drection">
          <!-- 这里写一段文字 -->
          <div class="top-ai-bg-contanier-text">Welcome to Zelop! If you have any requests, just let me know and we'll enjoy the fun of hip-hop together!</div>
          <!-- <div class="top-ai-bg-contanier">
            <div class="top-ai-bg-contanier-text">Zelop AI</div>
            <div class="top-ai-bg-contanier-image"></div>
          </div> -->
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
      </div>
      <!-- bottom -->
      <div class="bottom-section">
        <div class="bottom-scroll" ref="bottomScrollRef">
          <div v-for="(item, index) in bottomItems" :key="index" class="chat-item">
            <div class="chat-choose" v-if="item.sendId === '0'">
                <div class="chat-time">{{ item.time }}</div>
                    <div class="chat-content">
                    <img class="chat-avatar" src="@/assets/aiavator.png" alt="AI Avatar" />
                    <div class="chat-message">
                      <div v-if="item.loading" class="chat-loading">
                        <div class="chat-loading-dots" aria-label="loading">
                          <span class="dot"></span>
                          <span class="dot"></span>
                          <span class="dot"></span>
                        </div>
                        <!-- <div class="chat-loading-text">{{ item.message }}</div> -->
                      </div>
                      <div v-else>{{ item.message }}</div>
                    </div>
                </div>
            </div>
            <div class="chat-choose" v-else>
                <div class="chat-time">{{ item.time }}</div>
                    <div class="chat-content-rigth">
                    <div class="chat-message-rigth">{{ item.message }}</div>
                    <div class="chat-avatar-rigth-border-box">
                      <div class="chat-avatar-rigth"> 
                        <img :src="currentUserStore.currentUser.avator" alt="AI Avatar" />
                      </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部输入框 -->
    <!-- bottom input box -->
    <div class="bottom-input-wrap" :style="{ transform: `translateY(-${keyboardOffset}px)` }">
      <div class="bottom-input">
        <input type="text" placeholder="Say something" v-model="chatInput" />
        <div class="send-icon" @click="sendMessage" >
          <img src="@/assets/commentsend.png" alt="Send" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import BackButton from '@/components/back.vue'
import { useCurrentUserStore } from '@/stores/currentUser'
import { sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'
import { aiChat } from '@/utils/ai'
import { decryptAES } from '@/utils/aes'

const formatTime12 = (date) => {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`
}

const messages = ref([
  'How to avoid smudging the eye makeup?',
  'Which items are essential for a light makeup?',
  'How to make the foundation last longer for oily skin?'
])

const currentUserStore = useCurrentUserStore()

const getFirstTime = () => {
  const key = 'chat_first_time'
  const saved = localStorage.getItem(key)

  if (saved) return saved

  const now = new Date()
  const time = formatTime12(now) // changed here
  localStorage.setItem(key, time)

  return time
}

const bottomItems = ref([
  { sendId: '0', time: getFirstTime(), message: 'Hi there! I\'m Zelop, your AI buddy for all things fun and.'},
])

const isWaiting = ref(false)

const bottomScrollRef = ref(null)

function scrollToBottom() {
  nextTick(() => {
    const el = bottomScrollRef.value
    if (!el) return
    el.scrollTop = el.scrollHeight
  })
}

async function handleMessageClick(message) {
  const time = formatTime12(new Date()) // changed here
  bottomItems.value.push({
    sendId: currentUserStore.currentUser.id,
    time,
    message: message
  })

  scrollToBottom()

  sendShowLoadingToIOS(true)

  try {
    const res = await aiChat(message)

    sendShowLoadingToIOS(false)

    if (res.data.code === '0000') {
      // 1 解密
      const decryptText = decryptAES(res.data.result)
      // 2 转 JSON
      const data = JSON.parse(decryptText)
      const aiMessage = data?.output?.choices?.[0]?.message?.content || ''
      
      // 然后 push 到聊天列表
      bottomItems.value.push({
        sendId: '0',           // AI
        time: formatTime12(new Date()), // changed here
        message: aiMessage
      })
      scrollToBottom()
    } else {
      sendShowToastToIOS(res.data.message)
    }

  } catch (err) {
    sendShowLoadingToIOS(false)
    sendShowToastToIOS('Network error')
  }
}

const chatInput = ref('')
const keyboardOffset = ref(0)
let baseViewportHeight = 0

function isEditableElementFocused() {
  const activeEl = document.activeElement
  if (!activeEl) return false
  const tagName = activeEl.tagName
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || activeEl.isContentEditable
}

function updateKeyboardOffset() {
  const viewport = window.visualViewport
  if (!viewport) return

  if (!isEditableElementFocused()) {
    baseViewportHeight = viewport.height
  }

  const nextOffset = baseViewportHeight - viewport.height - viewport.offsetTop
  keyboardOffset.value = nextOffset > 0 ? nextOffset : 0
}

onMounted(() => {
  const viewport = window.visualViewport
  baseViewportHeight = viewport ? viewport.height : window.innerHeight
  if (!viewport) return

  viewport.addEventListener('resize', updateKeyboardOffset)
  viewport.addEventListener('scroll', updateKeyboardOffset)
})

onUnmounted(() => {
  const viewport = window.visualViewport
  if (!viewport) return

  viewport.removeEventListener('resize', updateKeyboardOffset)
  viewport.removeEventListener('scroll', updateKeyboardOffset)
})

async function sendMessage() {
  if (isWaiting.value) return
  const text = chatInput.value.trim()
  if (!text) return

  const time = formatTime12(new Date()) // changed here

  bottomItems.value.push({
    sendId: currentUserStore.currentUser.id,
    time,
    message: text
  })

  // 发送后立即清空输入框（避免等待过程中用户继续编辑造成错觉）
  chatInput.value = ""
  scrollToBottom()

  const placeholderIndex = bottomItems.value.length
  bottomItems.value.push({
    sendId: '0', // AI placeholder
    time: formatTime12(new Date()),
    message: '',
    loading: true
  })
  scrollToBottom()

  isWaiting.value = true
  sendShowLoadingToIOS(true)
  try {
    const res = await aiChat(text)

    sendShowLoadingToIOS(false)

    if (res.data.code === '0000') {
      // 1 解密
      const decryptText = decryptAES(res.data.result)
      // 2 转 JSON
      const data = JSON.parse(decryptText)
      const aiMessage = data?.output?.choices?.[0]?.message?.content || ''
      
      // 替换等待中的占位气泡
      if (bottomItems.value[placeholderIndex]?.loading) {
        bottomItems.value.splice(placeholderIndex, 1, {
          sendId: '0',
          time: formatTime12(new Date()),
          message: aiMessage,
          loading: false
        })
      }
      scrollToBottom()
    } else {
      // 接口失败时移除占位气泡
      if (bottomItems.value[placeholderIndex]?.loading) {
        bottomItems.value.splice(placeholderIndex, 1)
      }
      sendShowToastToIOS(res.data.message)
      scrollToBottom()
    }

  } catch (err) {
    sendShowLoadingToIOS(false)
    // 网络错误时移除占位气泡
    if (bottomItems.value[placeholderIndex]?.loading) {
      bottomItems.value.splice(placeholderIndex, 1)
    }
    sendShowToastToIOS('Network error')
    scrollToBottom()
  } finally {
    isWaiting.value = false
  }
}
</script>

<style scoped>
.page {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* prevent scrolling */
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
}

.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* justify-content: center; */
}

.top-bgc {
  width: 100%;
  height: calc(100vh * 281 / 812);
  background-image: url('@/assets/aibgban.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}

/* .aiusermodel {
  position: absolute;
  left: calc(100vw * 20 / 375);
  top: calc(100vh * 40 / 812);
  width: calc(100vw * 179 / 375);
  height: calc(100vh * 314 / 812);
  opacity: 1;
  background-image: url('@/assets/aiusermodel.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.aichatmodel {
  position: absolute;
  left: calc(100vw * 181 / 375);
  top: calc(100vh * 62 / 812);
  width: calc(100vw * 104 / 375);
  height: calc(100vh * 38 / 812);
  opacity: 1;
  background-image: url('@/assets/aichatmodel.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
} */

.top-section {
  position: relative;
  margin-top: calc(100vh * 56 / 812);
  margin-left: calc(100vw * 20 / 375);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: calc(100vh * 14 / 812);
}

.top-section p {
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  /* color: #fff; */
  background: rgba(255, 255, 255, 1);
  /* background: linear-gradient(
    141.29deg,
    rgba(255, 110, 50, 1) 0%,
    rgba(253, 61, 104, 1) 44.94%,
    rgba(251, 226, 100, 1) 100%
  ); */
  -webkit-background-clip: text; /* 仅对文本裁剪背景 */
  -webkit-text-fill-color: transparent; /* 文字透明，让背景显示 */
  background-clip: text; /* 标准属性，兼容非 webkit 浏览器 */
  margin: 0;
}

.top-ai-out-drection {
  display: flex;
  justify-content: center;
  margin-top: calc(100vh * 22 / 812);
}

.top-ai-bg-contanier {
  position: relative;
  width: calc(100vw * 335 / 375);
  height: calc(100vh * 84 / 812);
  background-image: url('@/assets/aibgconteniii.png');
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
}

.top-ai-bg-contanier-text {
  position: absolute;
  top: calc(100vh * 120 / 812);
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 170 / 375);
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: 16PX;
  /* font-size: calc(100vw * 16 / 375); */
  font-weight: 400;
  line-height: calc(100vw * 22 / 375);
  color: rgba(255, 255, 255, 1);
}

.top-ai-bg-contanier-image {
  position: absolute;
  right: calc(100vw * 11 / 375);
  top: calc(100vh * -74 / 812);
  width: calc(100vw * 108 / 375);
  height: calc(100vh * 138 / 812);
  background-image: url('@/assets/aiuserpic.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
}

.center-section {
  margin-top: calc(100vh * 12 / 812);
  margin-bottom: calc(100vh * 18 / 812);
  margin-left: calc(100vw * 20 / 375);
  margin-right: calc(100vw * 36 / 375);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 5 / 812);
}

.message-box {
  display: inline-flex;
  align-items: center;
  padding: calc(100vh * 10 / 812) calc(100vw * 10 / 375);
  border-radius: 0px calc(100vw * 20 / 375) calc(100vw * 20 / 375) calc(100vw * 20 / 375);
  background: rgba(253, 61, 104, 0.1);
  /* backdrop-filter: blur(calc(100vw * 8 / 375)); */
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  letter-spacing: 0;
  color: rgba(94, 69, 58, 1);
  width: fit-content; /* Wrap width to content */
  justify-content: flex-start; /* Align content to left */
}

.bottom-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* ⚡ 关键 */
  border-radius: calc(100vw * 30 / 375) calc(100vw * 30 / 375) 0px 0px;
  /* background: rgba(255, 255, 255, 1); */
  box-shadow: 0px 0px calc(100vw * 4 / 375)  rgba(0, 0, 0, 0.1);
}

.bottom-scroll {
  flex: 1;
  min-height: 0; /* ⚡ 关键 */
  overflow-y: auto;
  padding: calc(100vh * 20 / 812) 0 calc(100vh * 100 / 812) 0;
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 15 / 812);
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
  gap: calc(100vh * 12 / 812);
}

.chat-time {
  text-align: center;
  /* font-family: 'PlayfairDisplayRegular', sans-serif; */
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 21.33 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.6);
}

.chat-content {
  display: flex;
  align-items: flex-start;
  gap: calc(100vw * 12 / 375);
  margin-left: calc(100vw * 20 / 375);
  margin-right: calc(100vw * 59 / 375);
}

.chat-content-rigth {
  display: flex;
  align-items: flex-start;
  justify-content: end;
  gap: calc(100vw * 12 / 375);
  margin-left: calc(100vw * 59 / 375);
  margin-right: calc(100vw * 20 / 375);
}

.chat-avatar {
  width: calc(100vw * 44 / 375);
  height: calc(100vw * 44 / 375);
  border-radius: 50%;
}

.chat-avatar-rigth-border-box {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.5);
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  border-radius: 50%; /* fully circular */
  display: flex;
  justify-content: center;
}

.chat-avatar-rigth {
  width: calc(100vw * 46 / 375);
  height: calc(100vw * 46 / 375);
  border-radius: 50%; /* fully circular */
  padding: calc(100vh * 2 / 812) calc(100vw * 2 / 375);
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
  border-radius: calc(100vw * 10 / 375);
  background: linear-gradient(90deg, #FB10FF 0%, #4851FD 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: calc(100vh * 10 / 812) calc(100vw * 10 / 375);
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
}

.chat-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: calc(100vh * 6 / 812);
}

.chat-loading-dots {
  display: flex;
  align-items: center;
  gap: calc(100vw * 6 / 375);
}

.chat-loading-dots .dot {
  width: calc(100vw * 6 / 375);
  height: calc(100vw * 6 / 375);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  animation: chat-dot-bounce 1.1s infinite;
}

.chat-loading-dots .dot:nth-child(2) {
  animation-delay: 0.15s;
}

.chat-loading-dots .dot:nth-child(3) {
  animation-delay: 0.3s;
}

.chat-loading-text {
  color: rgba(255, 255, 255, 1);
}

@keyframes chat-dot-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(calc(-1 * 100vh * 4 / 812));
  }
}

.chat-message-rigth {
  border-radius: calc(100vw * 10 / 375);
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: calc(100vh * 10 / 812) calc(100vw * 10 / 375);
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  letter-spacing: 0;
  color: rgb(255, 255, 255);
}

.bottom-input-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100vh * 90 / 812);
  background: linear-gradient(90deg, #10003A 0%, #0F0072 100%);
  overflow: hidden;
  z-index: 200;
  transition: transform 0.2s ease;
  will-change: transform;
}

.bottom-input {
  position: absolute;
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 20 / 375);
  top: 0;
  margin-top: calc(100vh * 10 / 812);
  height: calc(100vh * 48 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(calc(100vw * 32 / 375));
  display: flex;
  align-items: center;
  padding: 0 calc(100vw * 10 / 375) 0 calc(100vw * 16 / 375);
  gap: calc(100vw * 16 / 375);
  box-sizing: border-box;
}

.bottom-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  /* font-family: 'OPPOSansRegular', sans-serif; */
  font-size: calc(100vw * 15 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  letter-spacing: 0;
  color: #fff;
}

.bottom-input input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.send-icon {
  width: calc(100vw * 36 / 375);
  height: calc(100vw * 36 / 375);
  /* border-radius: 50%;
  background: linear-gradient(180deg, rgba(255, 0, 128, 1) 0%, rgba(236, 86, 184, 1) 100%); */
  /* cursor: pointer; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.send-icon img {
  width: calc(100vw * 36 / 375);
  height: calc(100vw * 36 / 375);
}
</style>