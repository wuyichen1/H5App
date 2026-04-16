<template>
  <div class="page">
    <!-- 头像背景 -->
    <div class="avatar-bg" :style="{ '--avatar-url': `url(${currentUser.avator})` }"></div>
    <!-- 可滑动内容 -->
    <div class="scroll-content">
      <div class="profile-block">
        <div class="top">
          <div class="top-avatar-border">
            <div class="top-avatar" :style="{ '--avatar-url': `url(${currentUser.avator})` }">
              <div
                class="follow-btn"
                v-if="userId !== currentUserStore.currentUser.userId && !currentUserStore.currentUser.follow.includes(userId)"
                @click.stop="handleFollow"
              ></div>
            </div>
          </div>
        </div>
        <div class="top-name">{{ currentUser.name }}</div>

        <div class="info-card">
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-number">{{ userPosts.length || 0 }}</div>
              <div class="stat-label">Posts</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ formatStatCount(currentUser.fans?.length || 0) }}</div>
              <div class="stat-label">Fans</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ formatStatCount(currentUser.follow?.length || 0) }}</div>
              <div class="stat-label">Follow</div>
            </div>
          </div>
          <div class="info-card-footer">
            <div class="intro-text">{{ currentUser.about }}</div>
            <template v-if="userId !== currentUserStore.currentUser.userId">
              <button type="button" class="message-btn" @click.stop="handleChat" aria-label="Chat">
                <span class="message-btn-icon"></span>
              </button>
            </template>
            <template v-else>
              <span class="message-btn-spacer" aria-hidden="true"></span>
            </template>
          </div>
        </div>
      </div>

      <div class="works-header">Works</div>
      <div class="post-list">
        <template v-if="userPosts.length > 0">
          <div
            class="post-item"
            v-for="post in userPosts"
            :key="post.dynamicId"
            @click="toPostDetail(post.dynamicId, post.dynamicType)"
          >
            <div
              class="post-report"
              v-if="userId !== currentUserStore.currentUser.userId"
              @click.stop="showReportFunc()"
            ></div>
            <div class="post-thumb" :style="{ backgroundImage: `url(${post.dynamicPic[0]})` }">
              <div class="post-isvideo-icon" v-if="post.dynamicType === 1"></div>
            </div>
            <div class="post-caption">
              <span class="post-caption-text">{{ post.dynamicDesc }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="post-list-empty">
            <Empty />
          </div>
        </template>
      </div>
    </div>
    <!-- 顶部按钮 -->
    <div class="top-btn">
        <BackButton/>
        <MoreButton v-if="userId !== currentUserStore.currentUser.userId" @click="showReportFunc()" />
    </div>
    <ReportDialog v-if="showReport" @close="showReport = false" @select="reportSelect" >
    </ReportDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useChatsStore } from '@/stores/chat'
import BackButton from '@/components/back.vue'
import MoreButton from '@/components/more.vue'
import ReportDialog from '@/components/reportChoose.vue'
import Empty from '@/components/empty.vue'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS, sendShowToLoginToIOS } from '@/utils/iosBridge'

const { userId } = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
})
// 用户信息
const userStore = useUserStore()
const currentUser = computed(() => {
  return userStore.getUserById(userId) || {}
})
// 用户帖子列表
const postStore = usePostStore()
const userPosts = computed(() => postStore.getPostsByUserId(userId))
const currentUserStore = useCurrentUserStore()
const chatStore = useChatsStore()
const router = useRouter()

const showReport = ref(false)

/** 大数字展示为 3.3w 等形式，仅影响展示 */
function formatStatCount(n) {
  const num = Number(n) || 0
  if (num >= 10000) {
    const w = num / 10000
    const s = Number.isInteger(w) ? String(w) : w.toFixed(1).replace(/\.0$/, '')
    return `${s}w`
  }
  return String(num)
}

function showReportFunc() {
  if (currentUserStore.currentUser.isguest == 1) {
    sendShowToLoginToIOS()
    return
  }
  showReport.value = true
}

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
    if (!blockList.includes(userId)) {
      blockList.unshift(userId)

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

// Handle follow action
function handleFollow() {
  if (currentUserStore.currentUser.isguest == 1) {
    sendShowToLoginToIOS()
    return
  }
  const currentUserId = currentUserStore.currentUser.userId

  // Update current user's follow list
  const currentUserFollow = currentUserStore.currentUser.follow ? [...currentUserStore.currentUser.follow] : []
  if (!currentUserFollow.includes(userId)) {
    currentUserFollow.unshift(userId)
  }

  // Update post user's fans list
  const postUserFans = currentUser.value.fans ? [...currentUser.value.fans] : []
  if (!postUserFans.includes(currentUserId)) {
    postUserFans.unshift(currentUserId)
  }

  // Update current user store and user store
  userStore.updateUser(currentUserId, { follow: currentUserFollow })

  userStore.updateUser(userId, { fans: postUserFans })
  
  sendShowToastToIOS('Followed successfully')
}

function handleChat() {
  if (currentUserStore.currentUser.isguest == 1) {
    sendShowToLoginToIOS()
    return
  }
  const currentUserFollow = Array.isArray(currentUserStore.currentUser.follow)
    ? currentUserStore.currentUser.follow
    : []

  const targetUserFans = Array.isArray(currentUser.value?.follow)
    ? currentUser.value.follow
    : []

  const postrCurrentUserId = currentUserStore.currentUser.userId

  if (!currentUserFollow.includes(userId) || !targetUserFans.includes(postrCurrentUserId)) {
    sendShowToastToIOS('You can only chat if you follow each other.')
    return
  }

  sendShowLoadingToIOS(true)
  const currentUserId = currentUserStore.currentUser.userId

  // 查找是否已有 chat
  const existChat = chatStore.chat.find(chat => {
    const ids = chat.chatUserIds || []
    return ids.includes(currentUserId) && ids.includes(userId)
  })

  let chatId

  if (existChat) {
    chatId = existChat.chatId
  } else {
    // 创建新的 chat
    const newChat = {
      chatId: String(chatStore.chat.length + 1),
      chatUserIds: [currentUserId, userId],
      lastSendContent: '',
      lastSendTime: new Date().toISOString(),
      unreadMsgCount: 0,
      lastSendUserId: currentUserId
    }

    chatStore.addChat?.(newChat)
    chatId = newChat.chatId
  }

  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {
    sendShowLoadingToIOS(false)
    // 跳转聊天页
    router.push({
      name: 'chat',
      params: { chatId: chatId }
    })

  }, delay)
}

//详情
function toPostDetail(dynamicId, dynamicType) {
  if (dynamicType == 0) {
    router.push({
      name: 'picPostDetails',
      params: { postId: dynamicId }   // ✅ 注意这里是 postId
    })
  }
  if (dynamicType == 1) {
    router.push({
      name: 'videoPostDetails',
      params: { postId: dynamicId }   // ✅ 同样修改
    })
  }
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #f2f3f5;
  overflow: hidden;
}

.avatar-bg {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100vh * 400 / 812);
  background: var(--avatar-url) no-repeat center;
  background-size: cover;
  pointer-events: none;
  overflow: hidden;
}

/* 头像图上的半透明遮罩（在底图之上、底部渐变之下） */
.avatar-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: rgba(255, 255, 255, 0.22);
  pointer-events: none;
}

.avatar-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.08) 0%,
    rgba(242, 243, 245, 0) 45%,
    #f2f3f5 100%
  );
  pointer-events: none;
}

.scroll-content {
  position: relative;
  padding-top: calc(100vh * 100 / 812);
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.profile-block {
  padding: 140PX 20PX;
  padding-bottom: 0PX;
}

.top {
  display: flex;
  justify-content: center;
  margin-top: calc(100vh * 8 / 812);
}

.top-avatar-border {
  /* border-radius: 50%; */
  padding: calc(100vw * 3 / 375);
  height: 80PX;
  width: auto;
  /* background: #fff; */
  /* 设置一个背景图片 */
  background-image: url('@/assets/avabg.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  /* box-shadow: 0 calc(100vw * 2 / 375) calc(100vw * 12 / 375) rgba(0, 0, 0, 0.08); */
  padding: 6PX 6PX 20PX 6PX;
  display: flex;
  justify-content: center;
}

.top-avatar {
  width: 60PX;
  height: 60PX;
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible;
}

.top-avatar::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 50%;
  background-image: var(--avatar-url);
  background-size: cover;
  background-position: center;
}

.follow-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(100vw * 22 / 375);
  height: calc(100vw * 22 / 375);
  background-image: url('@/assets/follow.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 2;
  cursor: pointer;
}

.top-name {
  margin-top: -20PX;
  padding: 0 calc(100vw * 8 / 375);
  font-size: 22PX;
  font-family: "Barlow-Black", system-ui, sans-serif;
  font-weight: 900;
  font-style: italic;
  line-height: 1.2;
  letter-spacing: 0.04em;
  color: #111;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
}

.info-card {
  margin-top: calc(100vh * 16 / 812);
  background: #fff;
  border-radius: calc(100vw * 20 / 375);
  padding: calc(100vh * 16 / 812) calc(100vw * 16 / 375) calc(100vh * 12 / 812);
  /* box-shadow: 0 calc(100vw * 4 / 375) calc(100vw * 24 / 375) rgba(0, 0, 0, 0.06); */
}

.user-stats {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 calc(100vw * 4 / 375);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 4 / 812);
  min-width: 0;
}

.stat-number {
  font-size: calc(100vw * 20 / 375);
  font-weight: 800;
  line-height: 1.2;
  color: #111;
}

.stat-label {
  font-size: calc(100vw * 13 / 375);
  font-weight: 500;
  line-height: 1.3;
  color: rgba(0, 0, 0, 0.55);
}

.info-card-footer {
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
  margin-top: calc(100vh * 18 / 812);
  /* padding-top: calc(100vh * 16 / 812); */
  /* border-top: 1px solid rgba(0, 0, 0, 0.06); */
}

.intro-text {
  flex: 1;
  min-width: 0;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: 1.45;
  color: rgba(0, 0, 0, 0.65);
  word-break: break-word;
  text-align: left;
}

.message-btn {
  flex-shrink: 0;
  width: 70PX;
  height: 40PX;
  padding: 0;
  border: none;
  /* border-radius: calc(100vw * 14 / 375); */
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: none;
}

.message-btn-icon {
  width: 70PX;
  height: 40PX;
  background-image: url('@/assets/chat_oth.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.message-btn-spacer {
  flex-shrink: 0;
  width: calc(100vw * 48 / 375);
  height: calc(100vw * 44 / 375);
}

.works-header {
  margin: calc(100vh * 20 / 812) calc(100vw * 20 / 375) calc(100vh * 10 / 812);
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #111;
}

.post-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: calc(100vw * 12 / 375) calc(100vw * 12 / 375);
  padding: 0 calc(100vw * 20 / 375) calc(100vh * 34 / 812);
  width: 100%;
  box-sizing: border-box;
}

.post-list-empty {
  grid-column: 1 / -1;
}

.post-item {
  min-width: 0;
  border-radius: calc(100vw * 16 / 375);
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 calc(100vw * 2 / 375) calc(100vw * 12 / 375) rgba(0, 0, 0, 0.06);
}

.post-report {
  position: absolute;
  top: calc(100vw * 8 / 375);
  right: calc(100vw * 8 / 375);
  width: calc(100vw * 26 / 375);
  height: calc(100vw * 26 / 375);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.92);
  background-image: url('@/assets/postpiccommentreport.png');
  background-size: 65%;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 3;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.post-thumb {
  width: 100%;
  height: 160PX;
  aspect-ratio: 3 / 4;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.post-isvideo-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 54PX;
  height: 54PX;
  background-image: url('@/assets/videopluse.png');
  background-size: 55%;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 2;
  pointer-events: none;
}

/* 外层只负责 padding 与宽度；行数限制放在内层，避免 padding + flex 子项导致 WebView 里 line-clamp 失效 */
.post-caption {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  padding: calc(100vw * 10 / 375) calc(100vw * 10 / 375) calc(100vw * 12 / 375);
}

.post-caption-text {
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  font-size: calc(100vw * 13 / 375);
  font-weight: 400;
  line-height: 1.4;
  color: #222;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
  overflow: hidden;
  /* 硬限制两行：WebView 里 line-clamp 偶发失效时仍不会超过两行（1.4×2≈2.8em） */
  max-height: 2.8em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  text-overflow: ellipsis;
}

@supports (max-height: 2lh) {
  .post-caption-text {
    max-height: 2lh;
  }
}

.top-btn {
  position: absolute;
  top: calc(100vh * 56 / 812);
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 20 / 375);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}
</style>