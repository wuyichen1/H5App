<template>
  <div class="agreement-page">

    <!-- Top Header -->
    <div class="header">
      <BackButton />
      <div class="title">User Agreement</div>
    </div>

    <!-- Content -->
    <div class="agreement-content">

      <h1>Tati User Agreement</h1>

      <p class="update-time">Last updated: 2026</p>

      <p>
        Welcome to <strong>Tati</strong>! Tati is a social platform designed for dance enthusiasts to connect, learn, and share their passion through innovative features including a vibrant community, AI-powered assistance, and engaging short video tutorials. Before using Tati, please read this User Agreement carefully. By accessing or using Tati, you agree to comply with this agreement and all applicable laws.
      </p>

      <h2>1. Project Description</h2>

      <p>
        Tati aims to create a global community where dancers of all levels can interact, inspire each other, and grow together. Our platform integrates social networking, AI technology, and multimedia content to enhance your dance experience.
      </p>

      <h2>2. Core Functions</h2>

      <ul>
        <li>Connect with dancers worldwide through community features</li>
        <li>Access AI-powered tools for personalized dance guidance and feedback</li>
        <li>Watch and create short video tutorials to learn and share dance techniques</li>
      </ul>

      <h2>3. AI Assistant</h2>

      <p>
        Our AI assistant provides tailored recommendations, real-time feedback, and practice plans to help you improve your skills efficiently and enjoyably.
      </p>

      <h2>4. Short Video Tutorials</h2>

      <p>
        Users can upload and view short dance tutorials, enabling quick learning and sharing of creative ideas within the community.
      </p>

      <h2>5. User Responsibilities</h2>

      <p>
        By using Tati, you agree to engage respectfully, provide accurate information, and adhere to all applicable laws and platform guidelines.
      </p>

      <h2>6. Content Guidelines</h2>

      <p>
        All shared content must be appropriate and lawful. Tati reserves the right to remove content that violates these guidelines or the User Agreement.
      </p>

      <h2>7. Account Security</h2>

      <p>
        You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted through your account.
      </p>

      <h2>8. Termination</h2>

      <p>
        Tati may suspend or terminate your account if you violate this agreement or engage in harmful behavior.
      </p>

      <h2>9. Updates to Agreement</h2>

      <p>
        We may update this User Agreement periodically. Continued use of the platform after changes indicates your acceptance of the updated terms.
      </p>

      <h2>10. Contact Us</h2>

      <p>
        For any questions or support, please reach out through the in-app support channels.
      </p>

      <h2>11. Join Tati Today!</h2>

      <p>
        Embrace your passion for dance and connect with a global community. Download Tati and start your dance journey now!
      </p>

    </div>

  </div>
</template>

<script setup>
import BackButton from '@/components/back.vue'
</script>

<style scoped>

p {
  margin: 0;
  padding: 0;
}

.agreement-page{
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* Use local background image */
  background: url('@/assets/pagebgc.png') no-repeat center center;
  background-size: cover;
  color: #000;
}

/* Top Header */
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

/* Content */
.agreement-content{
  flex:1;
  overflow-y:auto;
  padding: 0 calc(100vw * 20 / 375) calc(100vh * 20 / 812) calc(100vw * 20 / 375);
  /* background:rgba(0,0,0,0.45);
  backdrop-filter:blur(calc(100vw * 10 / 375));
  border-radius:calc(100vw * 20 / 375) calc(100vw * 20 / 375) 0 0; */
}

/* Main Title */
.agreement-content h1{
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 24 / 375);
  margin-bottom:calc(100vh * 10 / 812);
  color: rgba(255, 255, 255, 1);
}

/* Update Time */
.update-time{
  opacity:0.7;
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 12 / 375);
  margin-bottom:calc(100vh * 20 / 812);
}

/* Section Titles */
.agreement-content h2{
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 18 / 375);
  margin-top:calc(100vh * 24 / 812);
  margin-bottom:calc(100vh * 10 / 812);
  color:rgba(255, 110, 50, 1);
}

/* Paragraphs */
.agreement-content p{
  font-family: 'OPPOSansRegular', sans-serif;
  font-size:calc(100vw * 14 / 375);
  line-height:1.7;
  margin-bottom:calc(100vh * 10 / 812);
  color: rgba(255, 255, 255, 1);
}

/* Lists */
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