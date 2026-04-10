<template>
  <div class="page">
    <div class="content">
      <!-- 顶栏：渐变背景上展示返回、对方信息、更多 -->
      <div class="top-content">
        <div class="left-part">
          <BackButton />
          <div class="user-info" @click="goOtherHome(otherUser.userId)">
            <div class="avatar-border-box">
              <img class="avatar" :src="otherUser.avator" alt="avatar" />
            </div>
            <span class="username">{{ otherUser.name }}</span>
          </div>
        </div>

        <div class="right-part">
          <MoreButton @click="showReport = true" />
        </div>
      </div>

      <!-- 聊天内容：白色圆角卡片 -->
      <div class="chat-content">
        <div v-for="msg in messages" :key="msg.msgId" :class="['chat-item', { 'own-message': msg.userId === currentUserId }]">
          <!-- 时间：单独占一行 -->
          <!-- <div class="chat-time-row">
            <div class="chat-time">{{ formatTime(msg.sendTime) }}</div>
          </div> -->

          <!-- 文字：头像与气泡分两行；图片消息：头像与图同一行 -->
          <div
            class="chat-body"
            :class="{ 'chat-body--with-image': !!msg.sendPicUrl }"
          >
            <div class="chat-avatar-border">
              <img class="chat-avatar" @click="goOtherHome(msg.userId)" :src="getUserAvatar(msg.userId)" alt="avatar" />
            </div>

            <div class="chat-right">
              <div v-if="msg.userId === currentUserId && msg.sendPicUrl" class="chat-message-image">
                <div class="image-container">
                  <img :src="msg.sendPicUrl" alt="send image" />
                </div>
              </div>
              <div v-else class="chat-message" v-text="msg.sendContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部：工具栏 + 输入行（白底） -->
    <div class="bottom-input-wrap" :style="{ transform: `translateY(-${keyboardOffset}px)` }">
      <div class="footer-toolbar">
        <div class="footer-action-btn" @click="selectImage">
          <img src="@/assets/chatpicicon.png" class="footer-action-icon" alt="" />
        </div>
        <input ref="imageInput" type="file" accept="image/*" style="display:none" @change="handleImageChange" />
        <div class="footer-action-btn" @click="openVideoCall">
          <img src="@/assets/chatvideoicon.png" class="footer-action-icon" alt="" />
        </div>
      </div>
      <div class="bottom-input">
        <input type="text" placeholder="Say something" v-model="inputText" />
        <div class="send-btn" @click="sendMessage">
          <img src="@/assets/commentsend.png" alt="send" />
        </div>
      </div>
    </div>
    <!-- Video Call Sheet -->
    <transition name="slide-up">
      <div v-if="showVideoCall" class="video-call-sheet">
        <VideoCall :userId="otherUser.userId" @hangup="closeVideoCall" />
      </div>
    </transition>

    <ReportDialog v-if="showReport" @close="showReport = false" @select="reportSelect" >
    </ReportDialog>
  </div>
</template>

<script setup>
import { defineProps, defineOptions, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatsStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useMessagesStore } from '@/stores/message'
import { useCurrentUserStore } from '@/stores/currentUser'
import BackButton from '@/components/back.vue'
import MoreButton from '@/components/more.vue'
import VideoCall from '@/views/messageViews/videocall.vue'
import ReportDialog from '@/components/reportChoose.vue'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'
import { uploadSingleImage } from '@/utils/ossUpload'

defineOptions({ name: 'ChatView' })

const props = defineProps({
  chatId: String
})

const chatsStore = useChatsStore()
const userStore = useUserStore()
const currentUserStore = useCurrentUserStore()
const messagesStore = useMessagesStore()
const router = useRouter()
const currentUserId = currentUserStore.currentUser.userId

// 当前聊天室信息
const currentChat = chatsStore.getChatById(props.chatId)

// 点击用户头像跳转到用户主页
function goOtherHome(userId) {
  if (!userId) return
  router.push({ name: 'otherHome', params: { userId } })
}

// 获取聊天室中除自己以外的另一个用户信息
const otherUser = userStore.getOtherUserInChat(currentChat.chatUserIds)

const messages = ref(messagesStore.getMessagesByChatId(props.chatId))
function getUserAvatar(userId) {
  const user = userStore.getUserById(userId)
  return user?.avator || ''
}

function formatTime(timeStr) {
  const date = new Date(timeStr)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const inputText = ref('')
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

const imageInput = ref(null)

function selectImage() {
  imageInput.value && imageInput.value.click()
}

async function handleImageChange(e) {

  const file = e.target.files[0]
  if (!file) {
    return
  }

  sendShowLoadingToIOS(true)
  try {
    const url = await uploadSingleImage(file, 'template_development')

    console.log('uploaded image url:', url)

    // 这里可以创建一条图片消息
    messagesStore.addMessage?.({
        msgId: String(messagesStore.message.length + 1),
        chatId: props.chatId,
        userId: currentUserStore.currentUser.userId,
        sendContent: "",
        sendPicUrl: url,
        sendTime: new Date().toISOString()
    })

    chatsStore.updateChat?.(props.chatId, {
      lastSendContent : '[image message]',
      lastSendTime : new Date().toISOString(),
      unreadMsgCount : currentChat.unreadMsgCount + 1,
      lastSendUserId : currentUserStore.currentUser.userId
    })

    messages.value = messagesStore.getMessagesByChatId(props.chatId)

  } catch (err) {
    console.error('upload image failed', err)
    sendShowToastToIOS('Upload failed, please check your network.')
  } finally {
    sendShowLoadingToIOS(false)
  }

  e.target.value = ''
}

function sendMessage() {
  if(inputText.value.trim() !== '') {
    // 这里可以创建一条图片消息
    messagesStore.addMessage?.({
        msgId: String(messagesStore.message.length + 1),
        chatId: props.chatId,
        userId: currentUserStore.currentUser.userId,
        sendContent: inputText.value,
        sendPicUrl: '',
        sendTime: new Date().toISOString()
    })

    chatsStore.updateChat?.(props.chatId, {
      lastSendContent : inputText.value,
      lastSendTime : new Date().toISOString(),
      unreadMsgCount : currentChat.unreadMsgCount + 1,
      lastSendUserId : currentUserStore.currentUser.userId
    })

    messages.value = messagesStore.getMessagesByChatId(props.chatId)

    inputText.value = ''
  }
}

const showVideoCall = ref(false)

function openVideoCall() {
  showVideoCall.value = true
}

function closeVideoCall() {
  showVideoCall.value = false
}

const showReport = ref(false)
function reportSelect(value) {
  showReport.value = false
  if (value === 0) {
    router.push({ name: 'report' })
  } else if (value === 1) {
    //用户选择屏蔽
    sendShowLoadingToIOS(true)

    // 用户选择屏蔽时加入 blockList
    const blockList = currentUserStore.currentUser.blockList || []

    // 不存在才加入，避免重复
    if (!blockList.includes(otherUser.userId)) {
      blockList.unshift(otherUser.userId)

      // 使用 userStore 公共方法同步更新当前用户并回传 iOS
      userStore.updateUser(currentUserStore.currentUser.userId, { blockList: blockList })
    }

    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      sendShowLoadingToIOS(false)
      sendShowToastToIOS('Blocking successful')

      goBackOrClose()

    }, delay)
  }
}
</script>

<style scoped>
.page {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  /* background: linear-gradient(90deg, #f8e8f2 0%, #e8f5ee 100%); */
  background-image: url('@/assets/chatbg.png');
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.top-content {
  flex-shrink: 0;
  padding: calc(100vh * 52 / 812) calc(100vw * 20 / 375) calc(100vh * 12 / 812);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-part {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 10 / 375);
}

.avatar-border-box {
  border-radius: 50%;
  display: flex;
  justify-content: center;
}

.avatar {
  width: calc(100vw * 36 / 375);
  height: calc(100vw * 36 / 375);
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
}

.username {
  font-size: calc(100vw * 17 / 375);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-part {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.chat-content {
  flex: 1;
  min-height: 0;
  background: rgba(245, 245, 245, 1);
  border-radius: calc(100vw * 22 / 375) calc(100vw * 22 / 375) 0 0;
  box-shadow: 0 calc(100vw * -4 / 375) calc(100vw * 24 / 375) rgba(0, 0, 0, 0.04);
  overflow-y: auto;
  padding: calc(100vh * 20 / 812) calc(100vw * 16 / 375);
  padding-bottom: calc(100vh * 150 / 812);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 18 / 812);
}

.chat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 6 / 812);
  margin: 0;
}

.chat-time-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.chat-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 8 / 812);
  margin: 0 calc(100vw * 40 / 375) 0 calc(100vw * 12 / 375);
  max-width: calc(100% - calc(100vw * 12 / 375));
}

.chat-body.chat-body--with-image {
  flex-direction: row;
  align-items: flex-start;
  gap: calc(100vw * 10 / 375);
}

.chat-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: min(100%, calc(100vw * 260 / 375));
}

.chat-avatar-border {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.chat-avatar {
  width: calc(100vw * 40 / 375);
  height: calc(100vw * 40 / 375);
  border-radius: 50%;
  box-sizing: border-box;
  overflow: hidden;
  object-fit: cover;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.chat-message {
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 20 / 375);
  color: #fff;
  padding: calc(100vh * 11 / 812) calc(100vw * 16 / 375);
  /* border-radius: calc(100vw * 18 / 375); */
  border-radius: calc(100vw * 0 / 375) calc(100vw * 18 / 375) calc(100vw * 18 / 375) calc(100vw * 18 / 375);
  background: rgba(26, 27, 28, 1);
  word-break: break-word;
}

.chat-time {
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 12 / 375);
  font-weight: 400;
  line-height: 1.3;
  color: rgba(0, 0, 0, 0.38);
  text-align: center;
}

.chat-item.own-message {
  align-items: flex-end;
  margin: 0;
}

.chat-item.own-message .chat-body {
  align-items: flex-end;
  margin: 0 calc(100vw * 12 / 375) 0 calc(100vw * 40 / 375);
}

.chat-item.own-message .chat-body.chat-body--with-image {
  flex-direction: row-reverse;
  align-items: flex-start;
}

.chat-item.own-message .chat-right {
  align-items: flex-end;
}

.chat-item.own-message .chat-time {
  text-align: center;
}

.chat-item.own-message .chat-message {
  background: #4da3ff;
  color: #fff;
  border-radius: calc(100vw * 18 / 375) calc(100vw * 0 / 375) calc(100vw * 18 / 375) calc(100vw * 18 / 375);
}

.chat-message-image .image-container {
  border-radius: calc(100vw * 20 / 375);
  overflow: hidden;
}

.chat-message-image .image-container img {
  display: block;
  width: 120PX;
  max-width: calc(100vw * 220 / 375);
  height: auto;
  border-radius: calc(100vw * 20 / 375);
  object-fit: cover;
}

.bottom-input-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: calc(100vh * 10 / 812) calc(100vw * 20 / 375)
    calc(100vh * 30 / 812 + env(safe-area-inset-bottom, 0px));
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 10 / 812);
  transition: transform 0.2s ease;
  will-change: transform;
}

.footer-toolbar {
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
}

.footer-action-btn {
  width: 33PX;
  height: 33PX;
  border-radius: calc(100vw * 12 / 375);
  /* border: 1px solid #9dc8ff; */
  background: #fff;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-action-icon {
  width: calc(100vw * 33 / 375);
  height: calc(100vw * 33 / 375);
  object-fit: contain;
}

.bottom-input {
  height: 50PX;
  min-height: 50PX;
  border-radius: 999px;
  background: #f1f2f5;
  display: flex;
  align-items: center;
  padding: 0 calc(100vw * 6 / 375) 0 calc(100vw * 18 / 375);
  gap: calc(100vw * 10 / 375);
  box-sizing: border-box;
}

.bottom-input input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: calc(100vw * 15 / 375);
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: 0;
  color: #111;
}

.bottom-input input::placeholder {
  color: rgba(0, 0, 0, 0.35);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  /* background: #4da3ff; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.send-btn img {
  width: 50PX;
  height: 50PX;
  object-fit: contain;
}

.video-call-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>