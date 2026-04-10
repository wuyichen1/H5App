<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
      <span class="edit-title">Follow</span>
    </div>
    <!-- 关注列表 -->
    <div class="container">
      <div v-if="follows.length > 0" class="follow-list">
        <div v-for="(item, index) in follows" :key="index" class="follow-item">
          <div class="follow-card-bg"></div>
          <div class="follow-content">
            <div class="follow-left">
              <div class="user-info">
                <div class="user-basic">
                  <div class="avator-box-border">
                    <div class="avatar-box">
                      <div class="avatar-inner">
                        <img :src="item.avator" alt="avatar" />
                      </div>
                    </div>
                  </div>
                  <div class="user-name">{{ item.name }}</div>
                </div>
                <div class="user-intro">{{ item.about }}</div>
              </div>
            </div>
            <div class="follow-right" @click="cancelFollow(item.userId)"></div>
          </div>
        </div>
      </div>
      <Empty class="empty" v-else />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import BackButton from '@/components/back.vue'
import Empty from '@/components/empty.vue'
import { sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'

const currentUserStore = useCurrentUserStore()
const userStore = useUserStore()

const follows = computed(() => {
  return currentUserStore.currentUser?.follow?.map(userId => {
    // Here you can map userId to user info if you have a userStore
    // For now we return placeholder data
    return userStore.getUserById(userId)
  }) || []
})

function cancelFollow(userId) {
  sendShowLoadingToIOS(true)
  const currentUserId = currentUserStore.currentUser.userId

  // Remove userId from current user's follow list if it exists
  const currentUserFollow = currentUserStore.currentUser.follow ? [...currentUserStore.currentUser.follow] : []
  const index = currentUserFollow.indexOf(userId)
  if (index !== -1) {
    currentUserFollow.splice(index, 1)
  }

  // Update post user's fans list
  const otherUser = userStore.getUserById(userId)
  const otherUserFans = otherUser.fans ? [...otherUser.fans] : []
  const index2 = otherUserFans.indexOf(currentUserId)
  if (index2 !== -1) {
    otherUserFans.splice(index2, 1)
  }

  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {

    userStore.updateUser(currentUserStore.currentUser.userId, { follow: currentUserFollow })
    userStore.updateUser(userId, { fans: otherUserFans })

    sendShowLoadingToIOS(false)
    sendShowToastToIOS('Unfollow successfully')
  }, delay)
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
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-header {
  display: flex;
  align-items: center;
  gap: 16PX;
  padding: 58PX 20PX 0;
}

.edit-title {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 20PX;
  font-weight: 700;
  font-style: italic;
  background: #000;
  /* background: linear-gradient(
    141.29deg,
    rgba(255, 110, 50, 1) 0%,
    rgba(253, 61, 104, 1) 44.94%,
    rgba(251, 226, 100, 1) 100%
  ); */
  -webkit-background-clip: text; /* 仅对文本裁剪背景 */
  -webkit-text-fill-color: transparent; /* 文字透明，让背景显示 */
  background-clip: text; /* 标准属性，兼容非 webkit 浏览器 */
}

.container {
  flex: 1;
  overflow-y: auto;
  margin: 26PX 0 0;
  box-sizing: border-box;
}

.follow-list {
  margin: 0 20PX 0;
  display: flex;
  flex-direction: column;
  gap: 16PX;
  padding-top: 20PX;
  padding-bottom: 34PX;
  overflow: visible;
}

.follow-item {
  position: relative;
  height: 80PX;
  overflow: visible;
}

.follow-card-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 20PX;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2PX 4PX rgba(0, 0, 0, 0.06);
  z-index: 1;
}

.follow-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 16PX 10PX 16PX 0;
  box-sizing: border-box;
}

.follow-left {
  width: calc(100% - 50PX);
  flex: 1;
  min-width: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10PX;
  width: 100%;
  overflow: visible;
}

.user-basic {
  flex-shrink: 0;
  width: 66PX;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6PX;
  overflow: visible;
}

.avator-box-border {
  flex-shrink: 0;
  width: 94PX;
  height: 94PX;
  position: relative;
  top: -14PX;
  z-index: 2;
  background: url('@/assets/avabg.png') no-repeat center center;
  background-size: contain;
  display: flex;
  align-items: start;
  justify-content: center;
  padding-top: 5PX;
}

.avatar-box {
  flex-shrink: 0;
  width: 54PX;
  height: 54PX;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
}

.avatar-inner img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 14PX;
  font-weight: 700;
  /* line-height: calc(100vw * 14 / 375); */
  color: rgba(0, 0, 0, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
  margin-top: -50PX;
  padding-bottom: 12PX;
}

.user-intro {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 14PX;
  font-weight: 400;
  /* line-height: calc(100vw * 18.47 / 375); */
  color: rgba(0, 0, 0, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.follow-right {
  width: 76PX;
  height: 32PX;
  background-image: url('@/assets/removefollow.png');
  background-size: contain; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  margin-right: calc(100vw * 10 / 375);
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
