<template>
  <div class="page">
    <div class="header">
      <BackButton />
      <h1 class="title">SETTING</h1>
    </div>
    <main class="options-list">
      <div class="option" v-for="(option, index) in options" :key="index" @click="handleOption(index)">
        <span class="option-text">{{ option.text }}</span>
        <div class="option-right">
          <div class="arrow-placeholder"></div>
        </div>
      </div>
    </main>
    <div class="footer">
      <button class="btn delete-btn" @click="handleAction(true)">DELETE ACCOUNT</button>
      <button class="btn logout-btn" @click="handleAction(false)">LOG OUT</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCurrentUserStore } from '@/stores/currentUser'
import BackButton from '@/components/back.vue'
import { sendLogoutToIOS, sendShowLoadingToIOS } from '@/utils/iosBridge'

const options = ref([
  { text: 'Privacy Policy' },
  { text: 'User Agreement' },
  { text: 'Blacklist' },
  // { text: 'Wallet' },
  // { text: 'Edit personal information' }
])

const router = useRouter()
const userStore =  useUserStore()
const currentUserStore = useCurrentUserStore()

function handleOption(index) {
  switch (index) {
    case 0:
      router.push({ name: 'privacyPolicy' })
      break
    case 1:
      router.push({ name: 'userAgreement' })
      break
    case 2:
      router.push({ name: 'block' })
      break
    case 3:
      router.push({ name: 'coins' })
      break
    case 4:
      router.push({ name: 'edit' })
      break
    default:
      break
  }
}

function handleAction(isDelete) {
  sendShowLoadingToIOS(true)

  if (isDelete) {
    userStore.updateUser(currentUserStore.currentUser.userId, { isdelete: 1 })
  }

  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {
    sendShowLoadingToIOS(false)
    sendLogoutToIOS(isDelete)

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

h1 {
  margin: 0;
}

/* Header */
.header {
  min-height: 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: calc(100vh * 58 / 812) calc(100vw * 20 / 375) 0;
}

.title {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 20PX;
  font-weight: 700;
  background: #000;
  font-style: italic;
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

/* Options List */
.options-list {
  min-height: 0;
  flex: 1;
  padding: calc(100vh * 20 / 812) calc(100vw * 20 / 375) 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 16 / 812);
}

.option {
  height: calc(100vh * 52 / 812);
  background: rgba(255, 255, 255, 1);
  border-radius: calc(100vw * 12 / 375);
  box-shadow: 0 calc(100vw * 2 / 375) calc(100vw * 4 / 375) rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 calc(100vw * 16 / 375);
}

.option-text {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  color: #000;
  font-size: 16PX;
  font-weight: 400;
}

.option-right .arrow-placeholder {
  width: 14PX;
  height: 14PX;
  background-image: url('@/assets/seetinggoicon.png');
  background-size: contain; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  overflow: hidden;
}

/* Footer */
.footer {
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 23 / 812);
  padding-bottom: calc(100vh * 80 / 812);
}

.btn {
  width: 240PX;
  height: 56PX;
  border-radius: calc(100vw * 87 / 375);
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 17PX;
  font-weight: 500;
  color: #fff;
  text-align: center;
  /* 蓝色描边 */
  text-shadow:
    -2px -2px 0 rgba(255, 128, 128, 1),
     2px -2px 0 rgba(255, 128, 128, 1),
    -2px  2px 0 rgba(255, 128, 128, 1),
     2px  2px 0 rgba(255, 128, 128, 1),
     0px  2px 0 rgba(255, 128, 128, 1),
     0px -2px 0 rgba(255, 128, 128, 1),
     2px 0px 0 rgba(255, 128, 128, 1),
    -2px 0px 0 rgba(255, 128, 128, 1);
  background: rgba(252, 177, 177, 0.4);
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  /* box-shadow: 0px calc(100vw * 2 / 375) 0px  rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375)  rgba(200, 100, 154, 1),inset 0px calc(100vw * 2 / 375) 0px  rgba(255, 255, 255, 0.8); */
  border: 2PX solid rgba(252, 177, 177, 1);
}

.delete-btn {
  background: rgba(252, 177, 177, 0.4);
}

.logout-btn {
  background: rgba(252, 177, 177, 0.4);
}
</style>