<template>
  <div class="page">
    <header class="top-header">
      <BackButton />
      <h1 class="page-title">EDIT</h1>
    </header>

    <div class="content">
      <div class="avatar-block" @click="chooseAvatar">
        <div
          class="avatar-circle"
          :style="{ backgroundImage: `url(${topBlockImage})` }"
          role="img"
          aria-label="Avatar"
        />
        <div class="camera-badge" aria-hidden="true">
          <img src="@/assets/cameraicon.png" alt="" />
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="visually-hidden"
        @change="onFileChange"
      />

      <section class="form-stack">
        <div class="field">
          <div class="field-label">EMAIL</div>
          <div class="field-input dark">
            <input v-model="email" type="email" inputmode="email" autocomplete="email" placeholder="Please enter" />
          </div>
        </div>

        <div class="field">
          <div class="field-label">BIRTHDAY</div>
          <div class="field-input dark row" @click="openBirthdayPicker">
            <span class="row-text" :class="{ muted: !birthday }">{{ birthday || 'Please select' }}</span>
            <span class="chevron" aria-hidden="true" />
            <input
              ref="birthdayInput"
              v-model="birthday"
              :max="maxBirthday"
              class="birthday-native-input"
              type="date"
              lang="en-US"
              @click.stop
            />
          </div>
        </div>

        <div class="field">
          <div class="field-label">LOCATION</div>
          <div class="field-input dark row" @click="openLocationPicker">
            <span class="row-text">{{ location }}</span>
            <span class="chevron" aria-hidden="true" />
          </div>
        </div>

        <div class="field">
          <div class="field-label">GENDER</div>
          <div class="gender-row">
            <button
              type="button"
              class="gender-card"
              :class="{ 'is-selected': genderIndex === 0 }"
              @click="genderIndex = 0"
            >
              <div class="gender-card-icon woman" />
              <span class="gender-card-mark" :class="{ on: genderIndex === 0 }" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="gender-card"
              :class="{ 'is-selected': genderIndex === 1 }"
              @click="genderIndex = 1"
            >
              <div class="gender-card-icon man" />
              <span class="gender-card-mark" :class="{ on: genderIndex === 1 }" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <!-- <div class="footer-actions">
        <button type="button" class="next-btn" @click="saveProfile">
          <span class="next-btn-dots" aria-hidden="true" />
          <span class="next-btn-label">NEXT</span>
        </button>
      </div> -->
      <div class="next-btn" @click="saveProfile">NEXT</div>
    </div>

    <van-action-sheet
      v-model:show="locationSheetShow"
      :actions="locationActions"
      cancel-text="Cancel"
      close-on-click-action
      @select="onLocationSelect"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BackButton from '@/components/back.vue'
import { sendShowLoadingToIOS, sendShowToastToIOS, sendNewUserDataToIOS } from '@/utils/iosBridge'
import { uploadSingleImage } from '@/utils/ossUpload'
import defaultAvatar from '@/assets/avataricon.png'

const topBlockImage = ref(defaultAvatar)

const email = ref('')

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const getMaxBirthday = () => {
  const now = new Date()
  now.setFullYear(now.getFullYear() - 18)
  return formatDate(now)
}

const maxBirthday = getMaxBirthday()
const birthday = ref('2003-01-01')

const location = ref('LA')
const LOCATION_OPTIONS = ['LA', 'NYC', 'London', 'Tokyo', 'Shanghai']
const locationSheetShow = ref(false)
const locationActions = computed(() => LOCATION_OPTIONS.map((name) => ({ name })))

const genderIndex = ref(0)

const fileInput = ref(null)
const birthdayInput = ref(null)
const avatarFile = ref(null)

const chooseAvatar = () => {
  fileInput.value?.click()
}

const openBirthdayPicker = () => {
  const input = birthdayInput.value
  if (!input) return

  if (birthday.value > maxBirthday) {
    birthday.value = maxBirthday
  }

  if (typeof input.showPicker === 'function') {
    input.showPicker()
  } else {
    input.click()
  }
}

const openLocationPicker = () => {
  locationSheetShow.value = true
}

const onLocationSelect = (action) => {
  if (action?.name) {
    location.value = action.name
  }
}

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  avatarFile.value = file

  const reader = new FileReader()
  reader.onload = (ev) => {
    topBlockImage.value = ev.target?.result ?? defaultAvatar
  }
  reader.readAsDataURL(file)
}

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

const saveProfile = async () => {
  if (!email.value.trim()) {
    sendShowToastToIOS('Please enter email')
    return
  }
  if (!isValidEmail(email.value)) {
    sendShowToastToIOS('Please enter a valid email')
    return
  }

  sendShowLoadingToIOS(true)

  let avatarUrl = topBlockImage.value

  try {
    if (avatarFile.value) {
      avatarUrl = await uploadSingleImage(avatarFile.value, 'template_development')
    }

    const nameFromEmail = email.value.trim().split('@')[0] || email.value.trim()

    const newUserData = {
      avator: avatarUrl,
      email: email.value.trim(),
      name: nameFromEmail,
      birthday: birthday.value,
      location: location.value,
      gender: genderIndex.value,
    }

    sendShowLoadingToIOS(false)
    sendNewUserDataToIOS(newUserData)
  } catch (e) {
    console.error(e)
    sendShowLoadingToIOS(false)
    sendShowToastToIOS('Updated failed, please check your network.')
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
  padding: calc(100vh * 52 / 812) calc(100vw * 20 / 375) calc(100vh * 8 / 812);
  flex-shrink: 0;
}

.page-title {
  margin: 0;
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 20PX;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #0a0a0a;
  line-height: 1;
}

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 0 calc(100vw * 24 / 375) calc(100vh * 28 / 812);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.avatar-block {
  position: relative;
  align-self: center;
  margin-top: calc(100vh * 8 / 812);
  margin-bottom: calc(100vh * 28 / 812);
  width: 100PX;
  height: 100PX;
}

.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #bfe9ff;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 0 calc(100vw * 3 / 375) rgba(255, 255, 255, 0.65);
}

.camera-badge {
  position: absolute;
  right: calc(100vw * 4 / 375);
  bottom: calc(100vw * 4 / 375);
  width: 28PX;
  height: 28PX;
  border-radius: 50%;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-badge img {
  width: 17PX;
  height: 17PX;
  object-fit: contain;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 20 / 812);
}

.field-label {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0a0a0a;
  margin-bottom: calc(100vh * 8 / 812);
}

.field-input.dark {
  width: 100%;
  min-height: calc(100vh * 52 / 812);
  border-radius: calc(100vw * 22 / 375);
  background: #0a0a0a;
  box-sizing: border-box;
  padding: 0 calc(100vw * 18 / 375);
  display: flex;
  align-items: center;
}

.field-input.dark.row {
  justify-content: space-between;
  cursor: pointer;
  position: relative;
}

.field-input.dark input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'PoppinsRegular', system-ui, sans-serif;
  font-size: calc(100vw * 15 / 375);
  color: #c8c8c8;
  padding: calc(100vh * 14 / 812) 0;
}

.field-input.dark input::placeholder {
  color: #8a8a8a;
}

.row-text {
  font-family: 'PoppinsRegular', system-ui, sans-serif;
  font-size: calc(100vw * 15 / 375);
  color: #c8c8c8;
}

.row-text.muted {
  color: #8a8a8a;
}

.chevron {
  width: 0;
  height: 0;
  border-left: calc(100vw * 5 / 375) solid transparent;
  border-right: calc(100vw * 5 / 375) solid transparent;
  border-top: calc(100vw * 7 / 375) solid #fff;
  flex-shrink: 0;
  margin-left: calc(100vw * 10 / 375);
}

.birthday-native-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

.gender-row {
  display: flex;
  gap: calc(100vw * 14 / 375);
  margin-top: calc(100vh * 4 / 812);
}

.gender-card {
  flex: 1;
  position: relative;
  min-height: calc(100vw * 118 / 375);
  border: none;
  padding: calc(100vh * 18 / 812) calc(100vw * 8 / 375);
  border-radius: calc(100vw * 20 / 375);
  background: #fff;
  box-shadow: 0 calc(100vw * 2 / 375) calc(100vw * 12 / 375) rgba(0, 0, 0, 0.06);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gender-card.is-selected {
  box-shadow:
    0 calc(100vw * 2 / 375) calc(100vw * 12 / 375) rgba(0, 0, 0, 0.06),
    inset 0 0 0 calc(100vw * 2 / 375) rgba(160, 132, 232, 0.35);
}

.gender-card-icon {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.gender-card-icon.woman {
  width: calc(100vw * 48 / 375);
  height: calc(100vw * 48 / 375);
  background-image: url('@/assets/registerwomanicon.png');
}

.gender-card-icon.man {
  width: calc(100vw * 44 / 375);
  height: calc(100vw * 48 / 375);
  background-image: url('@/assets/registermanicon.png');
}

.gender-card-mark {
  position: absolute;
  right: calc(100vw * 10 / 375);
  bottom: calc(100vw * 10 / 375);
  width: calc(100vw * 22 / 375);
  height: calc(100vw * 22 / 375);
  border-radius: 50%;
  border: calc(100vw * 2 / 375) solid rgba(0, 0, 0, 0.12);
  background: transparent;
  box-sizing: border-box;
}

.gender-card-mark.on {
  border: 2PX solid rgba(176, 224, 252, 1);
  background: rgba(176, 224, 252, 0.4);
}

.gender-card-mark.on::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 45%;
  width: calc(100vw * 6 / 375);
  height: calc(100vw * 10 / 375);
  border: 2PX solid rgba(171, 83, 252, 1);
  border-width: 0 calc(100vw * 2.2 / 375) calc(100vw * 2.2 / 375) 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

.footer-actions {
  margin-top: auto;
  padding-top: calc(100vh * 28 / 812);
  display: flex;
  justify-content: center;
  padding-bottom: calc(100vh * 12 / 812);
}

/* .next-btn {
  position: relative;
  width: calc(100vw * 288 / 375);
  min-height: calc(100vh * 56 / 812);
  border: none;
  border-radius: calc(100vw * 999 / 375);
  padding: 0 calc(100vw * 24 / 375);
  background: linear-gradient(180deg, #c9ecff 0%, #a8dfff 100%);
  box-shadow:
    0 calc(100vw * 4 / 375) calc(100vw * 14 / 375) rgba(100, 180, 220, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
} */

.next-btn {
  width: 260PX;
  height: 56PX;
  border-radius: 87PX;
  /* font-family: 'PlayfairDisplayBlack', sans-serif; */
  font-size: 18PX;
  font-weight: 400;
  color: #fff;
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
  background-image: url('@/assets/buttonbg.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 24PX auto 34PX auto;
}

.next-btn-dots {
  position: absolute;
  left: 0;
  top: 0;
  width: 48%;
  height: 100%;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.95) 1.2px, transparent 1.5px);
  background-size: calc(100vw * 10 / 375) calc(100vw * 10 / 375);
  opacity: 0.55;
}

.next-btn-label {
  position: relative;
  z-index: 1;
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #136aa1;
}

@media (min-width: 480px) {
  .page-title {
    font-size: 22px;
  }
}
</style>
