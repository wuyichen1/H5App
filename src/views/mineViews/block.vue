<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
      <span class="edit-title">Blacklist</span>
    </div>
    <!-- 黑名单列表 -->
    <div class="container">
        <div class="block-list" v-if="blocks.length > 0">
            <div v-for="(item, index) in blocks" :key="index" class="block-item">
                <div class="block-card-bg"></div>
                <div class="block-content">
                  <div class="block-left">
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
                  <div class="block-right" @click="removeBlock(item.userId)"></div>
                </div>
            </div>
        </div>
        <Empty v-else class="empty" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import BackButton from '@/components/back.vue'
import Empty from '@/components/empty.vue'
import { sendShowLoadingToIOS } from '@/utils/iosBridge'

const currentUserStore = useCurrentUserStore()
const userStore = useUserStore()

const blocks = computed(() => {
  return currentUserStore.currentUser?.blockList?.map(userId => {
    // Here you can map userId to user info if you have a userStore
    // For now we return placeholder data
    return userStore.getUserById(userId)
  }) || []
})

function removeBlock(userId) {
  const currentUser = currentUserStore.currentUser
  if (!currentUser || !currentUser.blockList) return

  sendShowLoadingToIOS(true)

  const index = currentUser.blockList.indexOf(userId)
  
  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {

    if (index !== -1) {
      currentUser.blockList.splice(index, 1)
      userStore.updateUser(currentUser.userId, { blockList: currentUser.blockList })
    }

    sendShowLoadingToIOS(false)
    
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

.block-list {
  margin: 0 20PX 0;
  display: flex;
  flex-direction: column;
  gap: 16PX;
  padding-top: 20PX;
  padding-bottom: 34PX;
  overflow: visible;
}

.block-item {
  position: relative;
  height: 80PX;
  overflow: visible;
}

.block-card-bg {
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

.block-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 16PX 10PX 16PX 0;
  box-sizing: border-box;
}

.block-left {
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
  color: rgba(0, 0, 0, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.block-right {
  width: 76PX;
  height: 32PX;
  background-image: url('@/assets/cnacleblock.png');
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