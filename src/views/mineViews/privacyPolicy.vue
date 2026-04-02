<template>
  <div class="agreement-page">

    <!-- header -->
    <div class="header">
      <BackButton />
      <div class="title">Privacy Policy</div>
    </div>

    <!-- content -->
    <div class="agreement-content">

      <h1>Zelop Privacy Policy</h1>
      <p class="update-time">Last updated: 2026</p>

      <p>
        Welcome to <strong>Zelop</strong>, your ultimate AI-powered makeup assistant and short video tutorial platform. At Zelop, we are dedicated to helping you enhance your beauty routine with personalized AI recommendations and engaging video content. Your privacy is our priority. This Privacy Policy explains how Zelop collects, uses, and protects your information when you use our app and services.
      </p>

      <h2>1. Information We Collect</h2>

      <p>We collect information to provide and improve Zelop, including:</p>

      <ul>
        <li>Account details such as username, profile picture, and email address</li>
        <li>Device information like model, operating system, and unique identifiers</li>
        <li>Content you create or share, including makeup looks and tutorial videos</li>
        <li>Usage data including interactions with the AI makeup assistant and video tutorials</li>
        <li>Payment information when you purchase premium features or virtual goods</li>
      </ul>

      <h2>2. How We Use Your Information</h2>

      <p>Your information helps us to:</p>

      <ul>
        <li>Deliver and enhance Zelop’s AI makeup assistant and tutorial features</li>
        <li>Personalize your experience and content recommendations</li>
        <li>Maintain a safe and supportive community environment</li>
        <li>Process transactions and manage subscriptions</li>
        <li>Communicate important updates and support information</li>
      </ul>

      <h2>3. Sharing Your Information</h2>

      <p>We do not sell your personal data. We may share information only as necessary:</p>

      <ul>
        <li>With trusted service providers who support our platform operations</li>
        <li>When required by law or to protect Zelop’s rights and user safety</li>
        <li>To prevent fraud and abuse within the community</li>
      </ul>

      <h2>4. Data Security</h2>

      <p>We use industry-standard technical and organizational measures to safeguard your data against unauthorized access, alteration, or disclosure.</p>

      <h2>5. Data Retention</h2>

      <p>We retain your information only as long as necessary to provide services and comply with legal obligations.</p>

      <h2>6. Children’s Privacy</h2>

      <p>Zelop is not intended for users under the age required by applicable law. We do not knowingly collect personal information from children.</p>

      <h2>7. Your Rights</h2>

      <p>Depending on your location, you may have rights to:</p>

      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction or deletion of your information</li>
        <li>Restrict or object to certain types of processing</li>
      </ul>

      <h2>8. Changes to This Policy</h2>

      <p>We may update this Privacy Policy periodically. Continued use of Zelop after changes means you accept the updated terms.</p>

      <h2>9. Contact Us</h2>

      <p>If you have any questions or concerns about this Privacy Policy, please contact us through the support channels available within the Zelop app.</p>

    </div>
  </div>
</template>

<script setup>
import BackButton from '@/components/back.vue'
</script>

<style scoped>

p, h1 {
  margin: 0;
  padding: 0;
}

.agreement-page{
  width:100%;
  height:100vh;
  display:flex;
  flex-direction:column;
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
  color: #000;
}

/* 顶部 */
.header{
  display:flex;
  align-items:center;
  gap:calc(100vw * 12 / 375);
  padding:calc(100vh * 58 / 812) calc(100vw * 20 / 375) calc(100vh * 20 / 812);
}

.title{
  /* font-family: 'PlayfairDisplayBlack', sans-serif; */
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  background: #fff;
  -webkit-background-clip: text; /* 仅对文本裁剪背景 */
  -webkit-text-fill-color: transparent; /* 文字透明，让背景显示 */
  background-clip: text; /* 标准属性，兼容非 webkit 浏览器 */
}

/* 内容 */
.agreement-content{
  flex:1;
  overflow-y:auto;
  padding: 0 calc(100vw * 20 / 375) calc(100vh * 20 / 812) calc(100vw * 20 / 375);
  /* background:rgba(0,0,0,0.45); */
  /* backdrop-filter:blur(calc(100vw * 10 / 375)); */
  /* border-radius:calc(100vw * 20 / 375) calc(100vw * 20 / 375) 0 0; */
}

/* 标题 */
.agreement-content h1{
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 24 / 375);
  margin-bottom:calc(100vh * 10 / 812);
  color: rgba(255, 255, 255, 1);
}

/* 更新时间 */
.update-time{
  opacity:0.7;
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 12 / 375);
  margin-bottom:calc(100vh * 20 / 812);
  color: rgba(255, 255, 255, 1);
}

/* 小标题 */
.agreement-content h2{
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 18 / 375);
  margin-top:calc(100vh * 24 / 812);
  margin-bottom:calc(100vh * 10 / 812);
  color:rgba(255, 110, 50, 1);
}

/* 正文 */
.agreement-content p{
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 14 / 375);
  line-height:1.7;
  margin-bottom:calc(100vh * 10 / 812);
  color: rgba(255, 255, 255, 1);
}

/* 列表 */
.agreement-content ul{
  padding-left:calc(100vw * 18 / 375);
}

.agreement-content li{
  margin-bottom:calc(100vh * 6 / 812);
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 14 / 375);
  color: rgba(255, 255, 255, 1);
}
</style>