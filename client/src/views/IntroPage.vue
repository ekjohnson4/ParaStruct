<template>
  <div class="intro-page">
    <video autoplay muted loop playsinline class="background-video">
      <source src="@/assets/Intro_Video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="intro-content">
      <img class="intro-img" src="../assets/ParaStruct_Logo_New.webp" />
      <div class="intro-query">Are you experienced with foundation construction?</div>
      <div class="button-group">
        <button @click="answer(true)" class="btn intro-btn">Yes</button>
        <button @click="answer(false)" class="btn intro-btn">No</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMaterialsStore } from '@/stores/materials'
import { useRouter } from 'vue-router'

const store = useMaterialsStore()
const router = useRouter()

const answer = (experienced) => {
  store.setIntroAnswer(experienced)
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.intro-page {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}

.intro-query {
  font-size: 20px;
  font-weight: 700;
}

.intro-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: white;
  text-shadow: 0 0 10px black;
  padding: 20px;
}

.button-group {
  margin-top: 5px;
  display: flex;
  gap: 20px;
}

.intro-btn {
  color: white;
}

.intro-img {
  width: 80%;
  max-width: 1000px;
  height: auto;
}
</style>
