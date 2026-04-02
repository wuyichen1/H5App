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
          <div class="follow-left">
            <div class="user-info">
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
          <div class="follow-right" @click="cancelFollow(item.userId)"></div>
        </div>
      </div>
      <Empty class="empty" v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  gap: calc(100vw * 16 / 375);
  padding: calc(100vh * 58 / 812) calc(100vw * 20 / 375) 0;
}

.edit-title {
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
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
}

.container {
  flex: 1;
  overflow-y: auto;
  margin: calc(100vh * 20 / 812) 0 0;
  box-sizing: border-box;
}

.follow-list {
  margin: 0 calc(100vw * 20 / 375) 0;
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 16 / 812);
  padding-bottom: calc(100vh * 34 / 812);
}

.follow-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100vh * 79 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375) rgba(0, 0, 0, 0.06);
  padding: 0 calc(100vw * 16 / 375);
  box-sizing: border-box;
}

.follow-left {
  width: calc(100% - calc(100vw * 50 / 375));
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: calc(100vh * 8 / 812);
}

.user-info {
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
}

.avator-box-border {
  flex-shrink: 0; /* 禁止收缩 */
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  border-radius: 50%;
  background: linear-gradient(
    141.29deg,
    rgba(255, 110, 50, 1) 0%,
    rgba(253, 61, 104, 1) 44.94%,
    rgba(251, 226, 100, 1) 100%
  );
  padding: calc(100vw * 1 / 375);
}

.avatar-box {
  flex-shrink: 0; /* 禁止收缩 */
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
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
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: calc(100vw * 16 / 375);
  font-weight: 500;
  line-height: calc(100vw * 16.96 / 375);
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-intro {
  /* font-family: 'OPPOSansRegular', sans-serif; */
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-right {
  width: 24PX;
  height: 24PX;
  background-image: url('@/assets/removefollow.png');
  background-size: cover; /* 等比缩放覆盖 */
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
