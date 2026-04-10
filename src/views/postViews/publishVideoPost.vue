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
        <!-- Upload（video） -->
        <div class="theme-label">UPLOAD (VIDEO)</div>
        <!-- 视频上传 -->
        <div class="upload-list">
          <!-- 添加视频按钮 -->
          <label v-if="!uploadedVideo" class="upload-item">
            <input type="file" accept="video/*" style="display:none" @change="handleAddVideo" />
            <div class="upload-add"></div>
          </label>

          <!-- 已上传的视频第一帧显示 -->
          <template v-if="uploadedVideo">
            <label class="upload-item">
              <img class="upload-video-preview" :src="videoFirstFrame" alt="video preview" />
              <div class="upload-remove" @click="handleRemoveVideo"></div>
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
import { uploadSingleImage, uploadVideo } from '@/utils/ossUpload'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'

const text = ref('')
const selectedTheme = ref(0)

const otherStore =  useOtherStore()
const postStore = usePostStore()
const currentUserStore = useCurrentUserStore()

const uploadedVideo = ref(null)  // store the video file
const videoFirstFrame = ref('') // store the preview image

const handleAddVideo = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadedVideo.value = file;

  // 使用 URL.createObjectURL(file) 创建临时 URL
  const videoUrl = URL.createObjectURL(file);

  console.log(videoUrl);
  // 获取首帧封面
  videoFirstFrame.value = await getVideoInfo(videoUrl);

  // 释放 URL，防止内存泄漏
  // URL.revokeObjectURL(videoUrl); // 可在确认首帧生成后释放
};

const handleRemoveVideo = () => {
  uploadedVideo.value = null
  videoFirstFrame.value = ''
}

const handleRelease = async () => {
  // 1. 判断文案是否为空
  if (!text.value.trim()) {
    sendShowToastToIOS('Please fill in the post text.')
    return
  }

  if (!uploadedVideo.value) {
    sendShowToastToIOS('Please select a video.')
    return
  }

  sendShowLoadingToIOS(true)

  try {
    // 2. 上传视频
    const videoUrl = await uploadVideo(uploadedVideo.value,'template_development')
    console.log('视频 URL:', videoUrl)

    // 3. 上传视频第一帧图片
    const imageBlob = await (await fetch(videoFirstFrame.value)).blob()
    const imageFile = new File([imageBlob], 'first_frame.png', { type: 'image/png' })
    const imageUrl = await uploadSingleImage(imageFile,'template_development')
    console.log('视频第一帧 URL:', imageUrl)

    // 构造新帖子对象
    const newPost = {
      dynamicId: String(postStore.posts.length + 1), // 生成唯一ID
      userId: currentUserStore.currentUser.userId, // 可以替换为当前用户ID
      dynamicType: 1,
      dynamicDesc: text.value,
      dynamicTitleType: 0,
      dynamicPic: [imageUrl],
      dynamicVideo: videoUrl, // 如果有视频可以赋值
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

const getVideoInfo = async (videoUrl) => {
  return new Promise((resolve) => {
    let video = document.createElement("video");
    video.src = videoUrl;
    video.currentTime = 0.1; // 截取首帧
    video.preload = "metadata";

    video.addEventListener("loadeddata", async () => {
      let canvas = document.createElement("canvas"),
          width = video.videoWidth,
          height = video.videoHeight;

      canvas.width = width;
      canvas.height = height;

      // 等 100ms 渲染完成
      await new Promise((r) => setTimeout(r, 100));

      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

      const thumb = canvas.toDataURL("image/jpeg");

      // 释放资源
      canvas.width = 0;
      canvas.height = 0;
      video.src = "";
      video.load();
      video.remove();
      video = null;
      canvas = null;

      resolve(thumb);
    });
  });
};
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
}

.back {
  min-width: 0;
  padding-top: calc(100vh * 56 / 812);
  padding-left: calc(100vw * 20 / 375);
}

.page-content {
  min-width: 0;
  flex: 1;
  /* position: relative; */
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.input-box {
  position: relative;
  margin-top: calc(100vh * 18 / 812);
  margin-left: calc(100vw * 20 / 375);
  margin-right: calc(100vw * 20 / 375);
  height: calc(100vh * 174 / 812);
  border-radius: calc(100vw * 16 / 375);
  background: #fff;
  box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375)  rgba(0, 0, 0, 0.1);
  padding: calc(100vh * 12 / 812) calc(100vw * 12 / 375);
}

.post-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  font-family: "Barlow-Black", system-ui, sans-serif;
  font-size: 14PX;
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  background: transparent;
  color: #000;
}

.post-textarea::placeholder {
  color: rgba(186, 187, 194, 1);
}

.text-count {
  position: absolute;
  right: calc(100vw * 13 / 375);
  bottom: calc(100vh * 16 / 812);
  font-family: "Barlow-Black", system-ui, sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.47 / 375);
  color: rgba(186, 187, 194, 1);
}

.theme-label {
  margin-top: calc(100vh * 24 / 812);
  margin-left: calc(100vw * 20 / 375);
  font-family: "Barlow-Black", system-ui, sans-serif;
  font-size: 18PX;
  font-weight: 900;
  line-height: calc(100vw * 21.2 / 375);
  color: rgba(0, 0, 0, 1);
  text-align: left;
  font-style: italic;
}

.upload-list {
  display: flex;
  overflow-x: auto;
  margin-top: calc(100vh * 20 / 812);
  padding-left: calc(100vw * 20 / 375);
  padding-right: calc(100vw * 20 / 375);
  /* gap: calc(100vw * 10 / 375);  */
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

.upload-video-preview {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}

.upload-add {
  width: calc(100vw * 30 / 375);
  height: calc(100vw * 30 / 375);
  background-image: url('@/assets/uploadpic.png');
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
  /* background: linear-gradient(135deg, #FE14CC 0%, #FFB900 100%); */
  /* background: linear-gradient(141.29deg, rgba(255, 110, 50, 1) 0%, rgba(253, 61, 104, 1) 44.94%, rgba(251, 226, 100, 1) 100%); */
  /* box-shadow: 0px calc(100vw * 2 / 375) 0px  rgba(200, 100, 154, 1), 0px calc(100vw * 2 / 375) calc(100vw * 6 / 375)  rgba(200, 100, 154, 1),inset 0px calc(100vw * 2 / 375) 0px  rgba(255, 255, 255, 0.8); */
  background-image: url('@/assets/buttonbg.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: calc(100vh * 167 / 812) auto calc(100vh * 34 / 812) auto;
}
</style>