<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
    </div>
    <div class="content">
      <div class="top">
        <div class="top-block" :style="{ backgroundImage: `url(${topBlockImage})` }" @click="chooseAvatar">
            <div class="camera-corner">
            <img src="@/assets/cameraicon.png" alt="camera" />
            </div>
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display:none"
        @change="onFileChange"
      />
      <div class="second">
        <div class="second-section">
            <div class="label">Name</div>
            <div class="input-box">
            <input v-model="name" type="text" placeholder="Please enter" />
            </div>
        </div>
      </div>
      <div class="third">
        <div class="third-section">
            <div class="label">Birthday</div>
            <div class="input-box birthday-content" @click="openBirthdayPicker">
                <div class="birthday-input">{{ birthday }}</div>
                <div class="birthday-icon"></div>
            </div>
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
      <div class="third">
        <div class="third-section">
            <div class="label">Gender</div>
            <div class="gender-content">
                <div class="gender" @click="genderIndex = 0">
                    <div class="gender-box" :class="{ 'gender-box-active': genderIndex === 0 }">
                        <div class="gender-woman-icon"></div>
                    </div>
                    <div class="gender-text">Female</div>
                </div>
                <div class="gender" @click="genderIndex = 1">
                    <div class="gender-box" :class="{ 'gender-box-active': genderIndex === 1 }">
                        <div class="gender-man-icon"></div>
                    </div>
                    <div class="gender-text">Male</div>
                </div>
            </div>
        </div>
      </div>
      <div class="fourth-section">
        <div class="save-btn" @click="saveProfile">Save</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/back.vue'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS, sendNewUserDataToIOS } from '@/utils/iosBridge'
import { uploadSingleImage } from '@/utils/ossUpload'

// Use relative path for web build
const topBlockImage = ref('/src/assets/avataricon.png')

const name = ref('')

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const getDefaultBirthday = () => {
  const now = new Date()
  now.setFullYear(now.getFullYear() - 20)
  return formatDate(now)
}

const getMaxBirthday = () => {
  const now = new Date()
  now.setFullYear(now.getFullYear() - 18)
  return formatDate(now)
}

const maxBirthday = getMaxBirthday()
const birthday = ref(getDefaultBirthday())
const genderIndex = ref(0)

const fileInput = ref(null)
const birthdayInput = ref(null)
const avatarFile = ref(null)

const chooseAvatar = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
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

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarFile.value = file

  // 本地预览
  const reader = new FileReader()
  reader.onload = (ev) => {
    topBlockImage.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

const saveProfile = async () => {
  if (!name.value.trim()) {
    sendShowToastToIOS('Please enter name')
    return
  }

  sendShowLoadingToIOS(true)

  let avatarUrl = topBlockImage.value

  try {
    if (avatarFile.value) {
      avatarUrl = await uploadSingleImage(avatarFile.value, 'template_development')
    }

    let newUserData = {
        'avator':avatarUrl,
        'name':name.value,
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
  height: 100vh;
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-header {
  min-height: 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: calc(100vh * 58 / 812) calc(100vw * 20 / 375) 0;
}

.content {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.top, .second, .third {
  display: flex;
  justify-content: center;
}

.top-block {
  width: calc(100vw * 80 / 375);
  height: calc(100vw * 80 / 375);
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: calc(100vw * 1 / 375) solid rgba(255, 255, 255, 1);
  position: relative;
  /* margin-top: calc(100vh * 20 / 812); */
}

.camera-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 50%;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  /* transform: translate(calc(100vw * 4 / 375), calc(100vw * 4 / 812)); */
}

.camera-corner img {
  width: calc(100vw * 14 / 375);
  height: calc(100vw * 14 / 375);
}

.second-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100% - calc(100vh * 40 / 812));
  margin: calc(100vh * 30 / 812) 0 0;
}

.label {
  font-family: 'ArchivoNarrowBold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: calc(100vw * 26.94 / 375);
  color: rgb(255, 255, 255);
}

.input-box {
  width: 100%;
  height: calc(100vh * 54 / 812);
  border-radius: calc(100vw * 16 / 375);
  background: rgba(255, 255, 255, 1);
  /* box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375)  rgba(0, 0, 0, 0.1); */
  backdrop-filter: calc(100vw * 12 / 375);
  display: flex;
  align-items: center;
  padding: 0 calc(100vw * 16 / 375);
  box-sizing: border-box;
  cursor: pointer;
}

.birthday-content {
  justify-content: space-between;
  font-family: 'ArchivoNarrowRegular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.86 / 375);
  letter-spacing: 0;
  color: rgba(0, 0, 0, 0.5);
}

.birthday-input {
  flex: 1;
}

.birthday-native-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

.birthday-icon {
  width: calc(100vw * 19 / 375);
  height: calc(100vh * 19 / 812);
  background-image: url('@/assets/birthdayicon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.input-box input {
  width: 100%;
  border: none;
  outline: none;
  font-family: 'ArchivoNarrowRegular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.86 / 375);
  letter-spacing: 0;
  color: #000000;
  background: transparent;
}

.input-box input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.third-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100% - calc(100vh * 40 / 812));
  margin-top: calc(100vh * 20 / 812);
  position: relative;
}

.gender-content {
  display: flex;
  gap: calc(100vw * 54 / 375);
  margin-top: calc(100vh * 16 / 812);
}

.gender {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 10 / 375);
  cursor: pointer;
}

.gender-woman-icon {
  width: calc(100vw * 41 / 375);
  height: calc(100vh * 41 / 812);
  background-image: url('@/assets/registerwomanicon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.gender-man-icon {
  width: calc(100vw * 37 / 375);
  height: calc(100vh * 41 / 812);
  background-image: url('@/assets/registermanicon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.gender-text {
  font-family: 'ArchivoNarrowRegular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.86 / 375);
  letter-spacing: 0;
  color: #ffffff;
}

.gender-box {
  width: calc(100vw * 60 / 375);
  height: calc(100vh * 60 / 812);
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: calc(100vw * 2 / 375) solid transparent;
  box-sizing: border-box;
}

.gender-box-active {
  border: calc(100vw * 2 / 375) solid rgba(142, 108, 219, 1);
}

.fourth-section {
  margin: calc(100vh * 37 / 812) 0 calc(100vh * 34 / 812);
  display: flex;
  justify-content: center;
  width: 100%;
}

.save-btn {
  width: calc(100vw * 264 / 375);
  height: calc(100vh * 60 / 812);
  background-image: url('@/assets/zhubtnbgi.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-family: 'ArchivoNarrowBold', sans-serif;
  font-size: calc(100vw * 24 / 375);
  font-weight: 700;
  line-height: calc(100vw * 32.33 / 375);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>