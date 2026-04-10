<template>
  <div class="page">
    <div class="back">
      <BackButton/>
    </div>
    <div class="page-content">
        <!-- 输入框 -->
        <div class="input-box">
          <textarea
            v-model="text"
            maxlength="150"
            class="post-textarea"
            placeholder="Please enter"
          ></textarea>
          <div class="text-count">{{ text.length }}/150</div>
        </div>
        <!-- Theme -->
        <div class="theme-label">TOPIC</div>
        <!-- ThemeList -->
        <div class="theme-list">
          <div v-for="(theme, index) in otherStore.other.postTheme" :key="index" class="theme-item" :class="{ selected: selectedTheme === index }" @click="selectedTheme = index">{{ theme }}</div>
        </div>
        <!-- Upload（Pic） -->
        <div class="theme-label">UPLOAD (PIC)</div>
        <!-- 图片上传 -->
        <div class="upload-list">
          <!-- 添加图片按钮 -->
          <label
            v-if="uploadedImagesFiles.length < maxImages"
            class="upload-item"
          >
            <input type="file" accept="image/*" multiple style="display:none" @change="handleAddImage" />
            <div class="upload-add"></div>
          </label>
          <!-- 预览已选择但未上传的图片 -->
          <template v-if="uploadedImagesFiles.length > 0">
            <label
              v-for="(file, index) in uploadedImagesFiles"
              :key="index"
              class="upload-item"
            >
              <div
                class="upload-image"
                :style="{ backgroundImage: file ? `url(${file.preview || file._previewUrl || URL.createObjectURL(file)})` : '' }"
              ></div>
              <div class="upload-remove" @click="handleRemoveImage(index)"></div>
            </label>
          </template>
        </div>
        <!-- Release -->
        <div class="release-button" @click="handleRelease">RELEASE</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useOtherStore } from '@/stores/other'
import { usePostStore } from '@/stores/post'
import { useCurrentUserStore } from '@/stores/currentUser'
import BackButton from '@/components/back.vue'
import { uploadMultipleImages } from '@/utils/ossUpload.js'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'

const text = ref('')
const selectedTheme = ref(0)

const otherStore = useOtherStore()

const maxImages = 5
const uploadedImagesFiles = ref([]) // store selected File objects (local preview only)

const handleAddImage = (event) => {
  const files = Array.from(event.target.files)
  const remaining = maxImages - uploadedImagesFiles.value.length
  const toAdd = files.slice(0, remaining).map(file => {
    file.preview = window.URL.createObjectURL(file) // local preview only
    return file
  })
  uploadedImagesFiles.value.push(...toAdd)
}

const handleRemoveImage = (index) => {
  uploadedImagesFiles.value.splice(index, 1)
}

const postStore = usePostStore()
const currentUserStore = useCurrentUserStore()
const handleRelease = async () => {
  if (!text.value.trim()) {
    sendShowToastToIOS('Please fill in the post text.')
    return
  }
  if (!uploadedImagesFiles.value.length) {
    sendShowToastToIOS('Please select at least one image.')
    return
  }

  sendShowLoadingToIOS(true)

  try {
    // 上传图片到 OSS
    const urls = await uploadMultipleImages(uploadedImagesFiles.value, 'template_development')

    // 构造新帖子对象
    const newPost = {
      dynamicId: String(postStore.posts.length + 1), // 生成唯一ID
      userId: currentUserStore.currentUser.userId, // 可以替换为当前用户ID
      dynamicType: 0,
      dynamicDesc: text.value,
      dynamicTitleType: selectedTheme.value,
      dynamicPic: urls,
      dynamicVideo: '', // 如果有视频可以赋值
      dynamicLikeCount: 0,
      dynamicCommentCount: 0
    }

    // 添加到帖子列表
    postStore.addPost(newPost)

    sendShowToastToIOS('Post released successfully')
    goBackOrClose()
    
  } catch (err) {
    console.error('上传失败', err)
    sendShowToastToIOS('Upload failed, please check your network.')
  } finally {
    sendShowLoadingToIOS(false)
  }
}
</script>

<style scoped>
.page {
  /* position: relative; */
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
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.input-box {
  position: relative;
  margin-top: calc(100vh * 16 / 812);
  margin-left: calc(100vw * 20 / 375);
  margin-right: calc(100vw * 20 / 375);
  height: calc(100vh * 174 / 812);
  border-radius: calc(100vw * 16 / 375);
  background: rgba(35, 30, 36, 1);
  box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375)  rgba(0, 0, 0, 0.1);
  padding: calc(100vh * 12 / 812) calc(100vw * 12 / 375);
  box-sizing: border-box;
}

.post-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  font-family: 'OPPOSansRegular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  background: transparent;
  color: #fff;
}

.post-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.text-count {
  position: absolute;
  right: calc(100vw * 13 / 375);
  bottom: calc(100vh * 16 / 812);
  font-family: "Barlow-Black", system-ui, sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  color: rgba(255, 255, 255, 0.6);
}

.theme-label {
  margin-top: calc(100vh * 24 / 812);
  margin-left: calc(100vw * 20 / 375);
  font-family: "Barlow-Black", system-ui, sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 900;
  line-height: calc(100vw * 21.2 / 375);
  color: rgba(0, 0, 0, 1);
  text-align: left;
  font-style: italic;
}

.theme-list {
  display: flex;
  justify-content: flex-start;
  gap: calc(100vw * 11 / 375);
  margin-left: calc(100vw * 20 / 375);
  margin-top: calc(100vh * 20 / 812);
}

.theme-item {
  width: calc(100vw * 94 / 375);
  height: calc(100vh * 40 / 812);
  border-radius: calc(100vw * 50 / 375);
  background: rgba(232, 232, 232, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Archivo', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: rgba(186, 187, 194, 1);
  cursor: pointer;
}

.theme-item.selected {
  background: rgba(176, 224, 252, 0.4);
  /* background: linear-gradient(135deg, rgba(255, 159, 142, 1) 0%, rgba(241, 213, 160, 1) 32.13%, rgba(201, 255, 221, 1) 67.84%, rgba(157, 255, 255, 1) 100%); */
  border: 2PX solid rgba(176, 224, 252, 1);
  color: #000;
  font-weight: 500;
  font-family: "Barlow-Black", system-ui, sans-serif;
}

.upload-list {
  display: flex;
  overflow-x: auto;
  margin-top: calc(100vh * 20 / 812);
  padding-left: calc(100vw * 20 / 375);
  padding-right: calc(100vw * 20 / 375);
  gap: calc(100vw * 5 / 375); /* 间距10，当有图片时 */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}

.upload-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.upload-item {
  width: calc(100vw * 108 / 375);
  height: calc(100vw * 108 / 375);
  flex-shrink: 0;
  border-radius: calc(100vw * 20 / 375);
  background: rgba(23, 23, 23, 1);
  backdrop-filter: blur(calc(100vw * 12 / 375));
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.upload-add {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  background-image: url('@/assets/cameraicon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: auto;
}

.upload-remove {
  position: absolute;
  top: calc(100vh * 6 / 812);
  right: calc(100vw * 6 / 375);
  width: calc(100vw * 15 / 375);
  height: calc(100vw * 15 / 375);
  background-image: url('@/assets/uploadremove.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 10;
}

/* Release Button Styles */
.release-button {
  width: 260PX;
  height: 56PX;
  border-radius: calc(100vw * 87 / 375);
  /* font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan', sans-serif; */
  font-size: 18PX;
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
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  /* box-shadow: 0px calc(100vw * 2 / 375) 0px  rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375)  rgba(200, 100, 154, 1),inset 0px calc(100vw * 2 / 375) 0px  rgba(255, 255, 255, 0.8); */
  /* 设置背景图片 */
  background-image: url('@/assets/buttonbg.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: calc(100vh * 157 / 812) auto calc(100vh * 54 / 812) auto;
}
</style>