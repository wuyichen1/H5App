<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
      <span class="edit-title">EDIT</span>
    </div>
    <div class="content">
      <div class="top">
        <div class="top-block" :style="{ backgroundImage: `url(${topBlockImage})` }" @click="chooseAvatar">
            <div class="camera-corner">
            <img src="@/assets/editicon.png" alt="camera" />
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
            <div class="label">NAME</div>
            <div class="input-box">
            <input v-model="name" type="text" placeholder="Please enter" />
            </div>
        </div>
      </div>
      <div class="third">
        <div class="third-section">
            <div class="label">ABOUT ME</div>
            <div class="input-box about-me-box">
            <textarea v-model="aboutMe" placeholder="Please enter"></textarea>
            </div>
        </div>
      </div>
      <div class="fourth-section">
        <div class="save-btn" @click="saveProfile">SAVE</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import BackButton from '@/components/back.vue'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'
import { uploadSingleImage } from '@/utils/ossUpload'

// Use relative path for web build
const topBlockImage = ref('/src/assets/avataricon.png')

const name = ref('')
const aboutMe = ref('')

const fileInput = ref(null)
const avatarFile = ref(null)

const currentUserStore = useCurrentUserStore()
const userStore =  useUserStore()

const chooseAvatar = () => {
  if (fileInput.value) {
    fileInput.value.click()
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

  if (!aboutMe.value.trim()) {
    sendShowToastToIOS('Please enter about me')
    return
  }

  sendShowLoadingToIOS(true)

  let avatarUrl = topBlockImage.value

  try {
    if (avatarFile.value) {
      avatarUrl = await uploadSingleImage(avatarFile.value, 'template_development')
    }

    const delay = avatarFile.value ? 0 : Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      userStore.updateUser(currentUserStore.currentUser.userId, { 
        avator: avatarUrl,
        name: name.value,
        about: aboutMe.value
      })

      sendShowLoadingToIOS(false)

      goBackOrClose()

      sendShowToastToIOS('Profile updated')
    }, delay)

  } catch (e) {
    console.error(e)
    sendShowLoadingToIOS(false)
    sendShowToastToIOS('Updated failed, please check your network.')
  }
}

onMounted(() => {
  const user = currentUserStore.currentUser
  if (!user) return

  name.value = user.name || ''
  aboutMe.value = user.about || ''

  if (user.avator) {
    topBlockImage.value = user.avator
  }
})
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

.content {
  position: relative;
  width: 100vw;
  height: calc(100% - calc(100vh * 98 / 812));
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.top, .second, .third {
    display: flex;
    justify-content: center;
}

.top-block {
  width: calc(100vw * 86 / 375);
  height: calc(100vw * 86 / 375);
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: calc(100vw * 2 / 375) solid #fff;
  box-sizing: border-box;
  position: relative;
  margin-top: calc(100vh * 20 / 812);
}

.camera-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 50%;
  /* background: rgba(0, 0, 0, 1); */
  display: flex;
  align-items: center;
  justify-content: center;
  /* transform: translate(calc(100vw * 4 / 375), calc(100vw * 4 / 812)); */
}

.camera-corner img {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
}

.second-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100% - calc(100vh * 40 / 812));
  margin: calc(100vh * 44 / 812) 0 0;
}

.label {
  font-family: 'Barlow-Black', system-ui, sans-serif;
  font-size: 18PX;
  font-weight: 900;
  font-style: italic;
  line-height: calc(100vw * 21.2 / 375);
  color: rgba(0, 0, 0, 1);
}

.input-box {
  width: 100%;
  /* height: calc(100vh * 54 / 812); */
  border-radius: calc(100vw * 16 / 375);
  background: rgba(23, 23, 23, 1);
  box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375)  rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 calc(100vw * 16 / 375);
  box-sizing: border-box;
}

.input-box input {
  width: 100%;
  height: calc(100vh * 54 / 812);
  border: none;
  outline: none;
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  letter-spacing: 0;
  color: #fff;
  background: transparent;
}

.input-box input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.third-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100% - calc(100vh * 40 / 812));
  margin-top: calc(100vh * 30 / 812);
}

/* .about-me-box {
  height: calc(100vh * 111 / 812);
} */

.about-me-box textarea {
  width: 100%;
  height: calc(100vh * 74 / 812);
  /* height: 100%; */
  border: none;
  outline: none;
  resize: none;
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  letter-spacing: 0;
  color: #fff;
  background: transparent;
  padding: calc(100vh * 16 / 812) 0;
  box-sizing: border-box;
}

.about-me-box textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.fourth-section {
  margin: calc(100vh * 204 / 812) 0 calc(100vh * 34 / 812);
  display: flex;
  justify-content: center;
  width: 100%;
}

.save-btn {
  width: calc(100vw * 300 / 375);
  height: calc(100vh * 55 / 812);
  border-radius: calc(100vw * 87 / 375);
  /* font-family: 'PlayfairDisplayBlack', sans-serif; */
  font-size: calc(100vw * 20 / 375);
  font-weight: 600;
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
  /* background: linear-gradient(135deg, #FE14CC 0%, #FFB900 100%); */
  /* box-shadow: 0px calc(100vw * 2 / 375) 0px  rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375)  rgba(200, 100, 154, 1),inset 0px calc(100vw * 2 / 375) 0px  rgba(255, 255, 255, 0.8); */
  background-image: url('@/assets/buttonbg.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>