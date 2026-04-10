<template>
  <div class="page">
    <div class="back">
      <BackButton/>
    </div>
    <div class="page-content">
      <div class="reason-grid">
        <div
          v-for="(item, index) in otherStore.other.reportContent"
          :key="index"
          class="reason-card"
          :class="{ selected: selectedIndex === index }"
          role="button"
          tabindex="0"
          @click="selectedIndex = index"
          @keydown.enter.prevent="selectedIndex = index"
          @keydown.space.prevent="selectedIndex = index"
        >
          <span class="reason-text">{{ item }}</span>
          <span class="reason-indicator" aria-hidden="true"></span>
        </div>
      </div>

      <div class="input-title">Supplementary description</div>

      <div class="input-box">
        <textarea
          v-model="inputText"
          class="input-field"
          maxlength="150"
          placeholder="Supplementary description (optional)"
        ></textarea>
        <div class="char-count">{{ inputText.length }}/150</div>
      </div>

      <div class="btn-box" @click="handleSubmit">SUBMIT</div>
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
  /* background: linear-gradient(
    165deg,
    #e8dff8 0%,
    #dff5ea 35%,
    #f7f7fb 65%,
    #ffffff 100%
  ); */
  /* 背景图片 */
  background-image: url('@/assets/pagebgc.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

.reason-grid {
  padding-top: calc(100vh * 18 / 812);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: calc(100vw * 12 / 375);
}

.reason-card {
  height: 100PX;
  padding: 14PX 14PX 12PX;
  border-radius: calc(100vw * 18 / 375);
  background: #ffffff;
  box-shadow: 0 calc(100vw * 2 / 375) calc(100vw * 14 / 375) rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  cursor: pointer;
  user-select: none;
  outline: none;
}

.reason-card:focus-visible {
  box-shadow: 0 0 0 2px rgba(72, 81, 253, 0.35);
}

.reason-text {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 500;
  line-height: 1.35;
  color: #0a0a0a;
  text-align: left;
  align-self: flex-start;
  padding-right: calc(100vw * 8 / 375);
}

.reason-indicator {
  align-self: flex-end;
  width: calc(100vw * 22 / 375);
  height: calc(100vw * 22 / 375);
  border-radius: 50%;
  background: rgba(245, 245, 245, 1);
  flex-shrink: 0;
  box-sizing: border-box;
}

.reason-card.selected .reason-indicator {
  background: rgba(176, 224, 252, 1);
  border: 2PX solid rgba(176, 224, 252, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.reason-card.selected .reason-indicator::after {
  content: '\2713';
  font-size: calc(100vw * 13 / 375);
  font-weight: 800;
  line-height: 1;
  color: rgba(171, 83, 252, 1);
}

.input-title {
  padding-top: calc(100vh * 28 / 812);
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 900;
  font-style: italic;
  /* line-height: 1.2; */
  /* letter-spacing: 0.02em; */
  text-transform: uppercase;
  color: #0a0a0a;
}

.input-box {
  position: relative;
  margin-top: calc(100vh * 12 / 812);
  border-radius: calc(100vw * 18 / 375);
  overflow: hidden;
  height: 130PX;
}

.input-field {
  display: block;
  width: 100%;
  height: 130PX;
  box-sizing: border-box;
  border: none;
  resize: none;
  outline: none;
  background: rgba(35, 30, 36, 1);
  border-radius: calc(100vw * 18 / 375);
  padding: calc(100vh * 14 / 812) calc(100vw * 16 / 375);
  padding-bottom: calc(100vh * 40 / 812);
  font-family: 'Barlow-Black', sans-serif;
  font-size: 15PX;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.96);
  line-height: calc(100vw * 22 / 375);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.38);
}

.char-count {
  position: absolute;
  right: calc(100vw * 14 / 375);
  bottom: calc(100vh * 12 / 812);
  font-family: 'Barlow-Black', sans-serif;
  font-size: 13PX;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1;
  pointer-events: none;
}

.btn-box {
  margin-top: auto;
  margin-bottom: calc(100vh * 32 / 812);
  width: 100%;
  height: 60PX;
  border-radius: calc(100vw * 999 / 375);
  /* background: linear-gradient(135deg, #FE14CC 0%, #FFB900 100%); */
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  /* box-shadow: 0px calc(100vw * 2 / 375) 0px rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375) rgba(200, 100, 154, 1), inset 0px calc(100vw * 2 / 375) 0px rgba(255, 255, 255, 0.8); */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 18PX;
  font-weight: 800;
  line-height: calc(100vw * 26.66 / 375);
  color: rgb(255, 255, 255);
  text-align: center;
  /* 蓝色描边 */
  text-shadow:
    -2px -2px 0 rgba(19, 106, 161, 1),
     2px -2px 0 rgba(19, 106, 161, 1),
    -2px  2px 0 rgba(19, 106, 161, 1),
     2px  2px 0 rgba(19, 106, 161, 1),
     0px  2px 0 rgba(19, 106, 161, 1),
     0px -2px 0 rgba(19, 106, 161, 1),
     2px 0px 0 rgba(19, 106, 161, 1),
    -2px 0px 0 rgba(19, 106, 161, 1);
  text-align: center;
  background-image: url('@/assets/buttonbg.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
