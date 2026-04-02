<template>
  <div class="page">
    <div class="back">
      <BackButton/>
    </div>
    <div class="page-content">
      <div class="category-list">
        <div
          class="category-btn"
          v-for="(item, index) in otherStore.other.reportContent"
          :key="index"
          :class="{ selected: selectedIndex === index }"
          @click="selectedIndex = index"
        >
          {{ item }}
        </div>
      </div>

      <div class="input-title">Supplementary description</div>

      <div class="input-box">
        <textarea
          v-model="inputText"
          class="input-field"
          maxlength="150"
          placeholder="Please enter"
        ></textarea>
        <div class="char-count">{{ inputText.length }}/150</div>
      </div>

      <div class="btn-box" @click="handleSubmit">Submit</div>
    </div>
  </div>
</template>

<script setup>
import { defineOptions, ref } from 'vue'
import BackButton from '@/components/back.vue'
import { useOtherStore } from '@/stores/other'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'

defineOptions({ name: 'ReportView' })

const otherStore =  useOtherStore()

const selectedIndex = ref(0)
const inputText = ref('')

function handleSubmit() {
  sendShowLoadingToIOS(true)

  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {
    sendShowLoadingToIOS(false)
    sendShowToastToIOS('Report successful')

    goBackOrClose()

  }, delay)
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.back {
  padding-top: calc(100vh * 56 / 812);
  padding-left: calc(100vw * 20 / 375);
}

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 0 calc(100vw * 20 / 375);
  display: flex;
  flex-direction: column;
}

.category-list {
  padding-top: calc(100vh * 22 / 812);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 12 / 812);
}

.category-btn {
  width: 100%;
  height: calc(100vw * 48 / 375);
  border-radius: calc(100vw * 999 / 375);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0px calc(100vw * 2 / 375) 0px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 18 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(255, 255, 255, 0.92);
}

.category-btn.selected {
  background: linear-gradient(90deg, #FB10FF 0%, #4851FD 100%);
  /* background: linear-gradient(90deg, rgba(255, 52, 125, 1) 0%, rgba(72, 81, 253, 1) 55%, rgba(255, 175, 75, 1) 100%); */
  box-shadow:
    0px calc(100vw * 6 / 375) calc(100vw * 12 / 375) rgba(72, 81, 253, 0.25),
    inset 0px 0px 0px 1px rgba(255, 255, 255, 0.18);
}

.input-title {
  padding-top: calc(100vh * 24 / 812);
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: calc(100vw * 22 / 375);
  font-weight: 400;
  line-height: calc(100vw * 24.2 / 375);
  color: rgba(255, 255, 255, 0.96);
}

.input-box {
  position: relative;
  margin-top: calc(100vh * 14 / 812);
  height: calc(100vh * 170 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(calc(100vw * 10 / 375));
  -webkit-backdrop-filter: blur(calc(100vw * 10 / 375));
  box-shadow: 0px 0px calc(100vw * 6 / 375) rgba(0, 0, 0, 0.06);
  padding: calc(100vh * 14 / 812) calc(100vw * 16 / 375);
  box-sizing: border-box;
}

.input-field {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  outline: none;
  background: transparent;
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.96); /* 输入文本颜色 */
  line-height: calc(100vw * 22 / 375);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.42);
}

.char-count {
  position: absolute;
  right: calc(100vw * 14 / 375);
  bottom: calc(100vh * 14 / 812);
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 14.5 / 375);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1;
}

.btn-box {
  margin-top: auto;
  margin-bottom: calc(100vh * 32 / 812);
  width: 100%;
  height: calc(100vh * 60 / 812);
  border-radius: calc(100vw * 999 / 375);
  background: linear-gradient(135deg, #FE14CC 0%, #FFB900 100%);
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  /* box-shadow: 0px calc(100vw * 2 / 375) 0px rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375) rgba(200, 100, 154, 1), inset 0px calc(100vw * 2 / 375) 0px rgba(255, 255, 255, 0.8); */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /* font-family: 'PlayfairDisplayBlack', sans-serif; */
  font-size: calc(100vw * 20 / 375);
  font-weight: 500;
  line-height: calc(100vw * 26.66 / 375);
  color: rgb(255, 255, 255);
  text-align: center;
}
</style>