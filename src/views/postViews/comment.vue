<template>
  <div class="comment">
    <div class="comment-container">
      <!-- 标题部分 -->
      <div class="comment-header">
        <!-- <div class="header-line" style="max-width: calc(100vw * 31 / 375);"></div> -->
        <div class="header-title">Comments</div>
        <!-- <div class="header-line"></div> -->
      </div>

      <!-- 评论列表 -->
      <div v-if="comments.length > 0" class="comment-list" >
        <div v-for="(item, index) in comments" :key="index" class="comment-item">
          <div class="comment-top">
            <div class="comment-user" @click="goOtherHome(item.userId)">
              <div class="avatar">
                <img :src="userStore.getUserById(item.userId).avator" alt="avatar" />
              </div>
              <div class="username">{{ userStore.getUserById(item.userId).name }}</div>
            </div>
            <img @click="openComment(item.userId)" v-if="item.userId !== currentUserStore.currentUser.userId" class="report-btn" src="@/assets/postpiccommentreport.png" alt="report" />
          </div>
          <div class="comment-text">{{ item.content }}</div>
        </div>
      </div>
      <Empty class="empty" v-else />
    </div>

    <!-- Bottom input box -->
    <div class="bottom-input">
      <input type="text" placeholder="Say something" v-model="inputText" />
      <div class="send-btn" @click="sendComment" >
        <img src="@/assets/commentsend.png" alt="send"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCommentsStore } from '@/stores/comment'
import { useUserStore } from '@/stores/user'
import { useCurrentUserStore } from '@/stores/currentUser'
import { usePostStore } from '@/stores/post'
import ReportDialog from '@/components/reportChoose.vue'
import Empty from '@/components/empty.vue'
import { sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true
  },
  reportAction: {
    type: Number,
    default: null
  } // 0 或 1
})

const postId = props.postId

const router = useRouter()

const commentsStore = useCommentsStore()
const userStore =  useUserStore()
const currentUserStore = useCurrentUserStore()
const postStore = usePostStore()
const comments = ref(commentsStore.getCommentsById(postId))

// 点击用户头像跳转到用户主页
function goOtherHome(userId) {
  if (!userId) return
  router.push({ name: 'otherHome', params: { userId } })
}

const inputText = ref('')

function sendComment() {
  const content = inputText.value.trim()
  if (!content) return // 输入为空直接返回

  // 创建评论对象
  const newComment = {
    commentId: String(commentsStore.comment.length + 1),
    dynamicId: String(postId),
    userId: currentUserStore.currentUser.userId,
    content: content
  }

  // 添加到评论 store
  commentsStore.addComment(newComment)

  // 更新帖子评论数量
  const post = postStore.getPostById(postId)
  postStore.updatePostById(postId, { dynamicCommentCount: (post.dynamicCommentCount || 0) + 1 })

  // 清空输入框
  inputText.value = ''

  // 重新获取评论列表，过滤掉被拉黑的用户
  comments.value = commentsStore.getCommentsById(postId)
}

const emit = defineEmits(['openCommentReport'])

// 打开帖子举报
function openComment(userId) {
  reportCommentUserId.value = userId
  emit('openCommentReport')
}

//帖子举报、拉黑
const reportCommentUserId = ref(null)

watch(
  () => props.reportAction,
  (newVal) => {
    if (newVal === null) return

    if (newVal === 0) {
      router.push({ name: 'report' })
    } else if (newVal === 1) {
      sendShowLoadingToIOS(true)

      const blockList = currentUserStore.currentUser.blockList || []
      if (!blockList.includes(reportCommentUserId.value)) {
        blockList.unshift(reportCommentUserId.value)
        userStore.updateUser(currentUserStore.currentUser.userId, { blockList })
      }

      const delay = Math.floor(Math.random() * 1500) + 500

      setTimeout(() => {
        sendShowLoadingToIOS(false)
        sendShowToastToIOS('Blocking successful')
        // 重新获取评论列表，过滤掉被拉黑的用户
        comments.value = commentsStore.getCommentsById(postId)

      }, delay)
    }
  }
)
</script>

<style scoped>
.comment {
  position: relative;
  /* width: 100%; */
  height: calc(100vh * 495 / 812);
  border-radius: calc(100vh * 40 / 812) calc(100vh * 40 / 812) 0 0;
  background: linear-gradient(180deg, rgb(16, 0, 58) 0%, rgb(15, 0, 114) 100%);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.comment-container {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comment-header {
  min-height: 0;
  display: flex;
  align-items: center;
  /* gap: calc(100vw * 6 / 375); */
  padding: calc(100vh * 30 / 812) calc(100vw * 20 / 375) 0;
}

/* .header-line {
  flex: 1;
  height: 1px;
  background-color: #fff;
} */

.header-title {
  /* padding: calc(100vh * 10 / 812) calc(100vw * 10 / 375); */
  border-radius: calc(100vw * 10 / 375);
  /* background: rgba(0, 0, 0, 1); */
  /* border: calc(100vw * 1 / 375) solid rgba(251, 226, 100, 1); */
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: calc(100vw * 18 / 375);
  font-weight: 600;
  line-height: calc(100vw * 19.08 / 375);
  letter-spacing: 0;
  color: rgb(255, 255, 255);
  white-space: nowrap;
/* 
  background: linear-gradient(180deg, rgba(255, 0, 128, 1) 0%, rgba(236, 86, 184, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
}

.comment-list {
  flex: 1;
  /* height: 0; */
  min-height: 0;
  padding: calc(100vh * 16 / 812) calc(100vw * 20 / 375) calc(100vh * 90 / 812);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 12 / 812);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Optional: hide scrollbar */
.comment-list::-webkit-scrollbar {
  display: none;
}

.comment-item {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 4 / 812);
  padding: calc(100vh * 14 / 812) calc(100vw * 14 / 375) calc(100vh * 16 / 812) calc(100vw * 16 / 375);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(calc(100vw * 12 / 375));
}

.comment-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-user {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
}

.avatar {
  flex-shrink: 0;
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  border-radius: 50%;
  /* border: calc(100vw * 1 / 375) solid rgba(251, 226, 100, 1); */
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  /* margin-bottom: calc(100vw * 4 / 375); */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.username {
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 16.96 / 375);
  letter-spacing: 0;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.report-btn {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
}

.comment-text {
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 12 / 375);
  font-weight: 400;
  flex-shrink: calc(100vw * 15.38 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
}

.bottom-input {
  position: absolute;
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 20 / 375);
  bottom: calc(100vh * 29 / 812);
  height: calc(100vh * 54 / 812);
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
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  letter-spacing: 0;
  color: #fff;
}

.bottom-input input::placeholder {
  color: rgb(182, 182, 182);
}

.send-btn {
  width: calc(100vw * 35 / 375);
  height: calc(100vw * 35 / 375);
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
  width: calc(100vw * 35 / 375);
  height: calc(100vw * 35 / 375);
}

.empty {
  padding: calc(100vw * 60 / 375) 0 0;
}
</style>