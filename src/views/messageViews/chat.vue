<template>
  <div class="page">
    <!-- 顶部背景层 -->
    <div class="top-background"></div>
    <!-- 内容部分 -->
    <div class="content">
      <!-- 顶部内容 -->
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
          <div class="icon-group">
            <img src="@/assets/chatpicicon.png" class="icon" @click="selectImage" />
            <input ref="imageInput" type="file" accept="image/*" style="display:none" @change="handleImageChange" />
            <img src="@/assets/chatvideoicon.png" class="icon" @click="openVideoCall" />
          </div>
          <MoreButton @click="showReport = true" />
        </div>
      </div>

      <!-- 聊天内容 -->
      <div class="chat-content">
        <div v-for="msg in messages" :key="msg.msgId" :class="['chat-item', { 'own-message': msg.userId === currentUserId }]">
          <!-- 时间：单独占一行 -->
          <div class="chat-time-row">
            <div class="chat-time">{{ formatTime(msg.sendTime) }}</div>
          </div>

          <!-- 内容：头像 + 气泡 同一行 -->
          <div class="chat-body">
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
    <!-- 底部输入框 -->
    <div class="bottom-input-wrap">
      <div class="bottom-input">
        <input type="text" placeholder="Say something" v-model="inputText" />
        <div class="send-btn" @click="sendMessage" >
          <img src="@/assets/commentsend.png" alt="send"/>
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
import { defineProps, defineOptions } from 'vue'
import { ref } from 'vue'
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
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
  overflow: hidden;
}

.top-background {
  height: calc(100vh * 162 / 812);
  /* background-image: url('@/assets/chattopbg.png'); */
  background-size: cover; /* 等比缩放覆盖 */
  overflow: hidden;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 16 / 812);
}

.top-content {
  padding:calc(100vh * 56 / 812) calc(100vw * 20 / 375) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-part {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
}

.avatar-border-box {
  border-radius: 50%;
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  display: flex;
  justify-content: center;
}

.avatar {
  width: calc(100vw * 36 / 375);
  height: calc(100vw * 36 / 375);
  padding: calc(100vh * 1 / 812) calc(100vw * 1 / 375);
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
}

.username {
  /* flex: 1;
  min-width: 0; */
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 16.96 / 375);
  letter-spacing: 0;
  background: #fff;
  /* background: linear-gradient(
    141.29deg,
    rgba(255, 110, 50, 1) 0%,
    rgba(253, 61, 104, 1) 44.94%,
    rgba(251, 226, 100, 1) 100%
  ); */
  -webkit-background-clip: text; /* 仅对文本裁剪背景 */
  -webkit-text-fill-color: transparent; /* 文字透明，让背景显示 */
  background-clip: text; /* 标准属性，兼容非 webkit 浏览器 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-part {
  display: flex;
  align-items: center;
  gap: calc(100vw * 19 / 375);
}

.icon-group {
  display: flex;
  gap: calc(100vw * 24 / 375);
}

.icon {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  cursor: pointer;
}

.chat-content {
  flex: 1;
  border-radius: calc(100vw * 20 / 375) calc(100vw * 20 / 375) 0 0;
  /* background-color: #fff; */
  /* backdrop-filter: blur(calc(100vw * 12 / 375)); */
  overflow-y: auto;
  padding-top: calc(100vh * 28 / 812);
  padding-bottom: calc(100vh * 90 / 812);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 23 / 812);
}

.chat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 8 / 812);
  margin: 0;
}

/* 时间单独一行 */
.chat-time-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* 头像与气泡同一行 */
.chat-body {
  display: flex;
  align-items: flex-end;
  gap: calc(100vw * 10 / 375);
  margin: 0 calc(100vw * 80 / 375) 0 calc(100vw * 20 / 375); /* 默认靠左消息 */
}

.chat-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* gap: calc(100vh * 8 / 812); */
}

.chat-avatar-border {
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  display: flex;
  justify-content: center;
}

.chat-avatar {
  width: calc(100vw * 44 / 375);
  height: calc(100vw * 44 / 375);
  border-radius: 50%;
  padding: calc(100vh * 2 / 812) calc(100vw * 2 / 375);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-shrink: 0; /* prevent avatar from being compressed */
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
  line-height: calc(100vw * 15.83 / 375);
  color: rgba(255, 255, 255, 1);
  padding: calc(100vh * 10 / 812) calc(100vw * 10 / 375);
  border-radius: calc(100vw * 10 / 375);
  /* background: rgba(251, 226, 100, 1); */
  background: linear-gradient(90deg, #FB10FF 0%, #4851FD 100%);
}

.chat-time {
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 13 / 375);
  font-weight: 400;
  line-height: calc(100vw * 21.1 / 375);
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.chat-item.own-message {
  /* flex-direction: row-reverse; */
  align-items: flex-end;
  margin: 0;
}

.chat-item.own-message .chat-body {
  flex-direction: row-reverse;
  margin: 0 calc(100vw * 20 / 375) 0 calc(100vw * 80 / 375); /* 自己消息靠右 */
}

.chat-item.own-message .chat-right {
  align-items: flex-start;
}

.chat-item.own-message .chat-time {
  text-align: center;
}

.chat-item.own-message .chat-message {
  border-radius: calc(100vw * 10 / 375);
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* image message styles */
.chat-message-image .image-container {
  border-radius: calc(100vw * 20 / 375);
  /* background: rgba(255, 255, 255, 1);
  padding: calc(100vw * 5 / 375); */
}

.chat-message-image .image-container img {
  width: 130PX;
  height: auto;
  border-radius: calc(100vw * 20 / 375);
  object-fit: contain;
}

.bottom-input-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100vh * 90 / 812);
  background: linear-gradient(90deg, #10003A 0%, #0F0072 100%);
  /* border-radius: calc(100vw * 40 / 375); */
  overflow: hidden;
}

.bottom-input {
  position: absolute;
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 20 / 375);
  top: 0;
  height: calc(100vh * 48 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(calc(100vw * 32 / 375));
  display: flex;
  align-items: center;
  margin-top: calc(100vh * 10 / 812);
  padding: 0 calc(100vw * 10 / 375) 0 calc(100vw * 16 / 375);
  gap: calc(100vw * 10 / 375);
  box-sizing: border-box;
}

.bottom-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  /* font-family: 'OPPOSansRegular', sans-serif; */
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  letter-spacing: 0;
  color: #fff;
}

.bottom-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.send-btn {
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

.send-btn img {
  width: calc(100vw * 36 / 375);
  height: calc(100vw * 36 / 375);
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