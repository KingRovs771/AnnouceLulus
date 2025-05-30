<template>
  <div class="home-page">
    <div class="header-banner">
      <div class="logo-group">
        <img src="../assets/TutWuri.png" alt="Logo Tut Wuri" class="logo-small" />
        <img src="../assets/Sragen.png" alt="Logo Sragen" class="logo-small" />
        <img src="../assets/Spensa.png" alt="Logo Spensa" class="logo-small" />
      </div>
    </div>

    <div class="content-wrapper">
      <div class="content-card">
        <h1 class="title">PENGUMUMAN KELULUSAN SMP NEGERI 1 SRAGEN</h1>
        <h1 class="title sub-title">TAHUN AJARAN 2024/2025</h1>

        <p class="instruction-text">
          Pengumuman hasil kelulusan akan tersedia pada:
        </p>

        <div class="countdown-timer-container">
          <div class="timer-box">
            <span class="value">{{ days }}</span>
            <span class="label">Hari</span>
          </div>
          <div class="timer-box">
            <span class="value">{{ hours }}</span>
            <span class="label">Jam</span>
          </div>
          <div class="timer-box">
            <span class="value">{{ minutes }}</span>
            <span class="label">Menit</span>
          </div>
          <div class="timer-box">
            <span class="value">{{ seconds }}</span>
            <span class="label">Detik</span>
          </div>
        </div>

        <p class="announcement-time">
          Waktu Pengumuman: {{ announcementTimeFormatted }}
        </p>

        <button v-if="countdownFinished" @click="goToAnnouncement" class="submit-button">
          Lihat Hasil Pengumuman
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import moment from 'moment-timezone';
import router from "../router/index.js";
// HomePage is no longer imported here as this component itself is designed to be the countdown.
// The navigation target is 'HomePage' by name.

// Set the target date and time to tomorrow at 08:00 AM WIB (GMT+7)
// Today's date is Thursday, May 29, 2025. Let's set it to tomorrow (May 30, 2025) at 08:00:00
const targetDate = ref(moment().tz("Asia/Jakarta").add(4, 'days').set({ hour: 17, minute: 0, second: 0, millisecond: 0 }));

const now = ref(moment());
let timerInterval = null;

const days = computed(() => {
  const diff = targetDate.value.diff(now.value);
  if (diff <= 0) return '00';
  return Math.floor(moment.duration(diff).asDays()).toString().padStart(2, '0');
});

const hours = computed(() => {
  const diff = targetDate.value.diff(now.value);
  if (diff <= 0) return '00';
  return moment.duration(diff).hours().toString().padStart(2, '0');
});

const minutes = computed(() => {
  const diff = targetDate.value.diff(now.value);
  if (diff <= 0) return '00';
  return moment.duration(diff).minutes().toString().padStart(2, '0');
});

const seconds = computed(() => {
  const diff = targetDate.value.diff(now.value);
  if (diff <= 0) return '00';
  return moment.duration(diff).seconds().toString().padStart(2, '0');
});

const countdownFinished = computed(() => {
  return targetDate.value.isSameOrBefore(now.value);
});

const announcementTimeFormatted = computed(() => {
  return targetDate.value.format("dddd, DD MMMM YYYY, HH:mm [WIB]");
});

const updateCountdown = () => {
  now.value = moment();
  if (countdownFinished.value) {
    clearInterval(timerInterval);
    // Redirect to HomePage once countdown is finished
    router.push({ name: "HomePage" });
  }
};

const goToAnnouncement = () => {
  // Directly navigate to HomePage if button is clicked
  router.push({name : "HomePage"})
};

onMounted(() => {
  timerInterval = setInterval(updateCountdown, 1000);
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  clearInterval(timerInterval);
  document.body.style.margin = '';
  document.body.style.padding = '';
  document.documentElement.style.height = '';
  document.body.style.height = '';
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Reset default browser margins/paddings for html and body globally */
/* These are handled via JS onMounted/onUnmounted in this specific example */

.home-page {
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a; /* Warna latar belakang gelap dari home page */
  color: #e0e0e0; /* Warna teks terang */
  font-family: Arial, sans-serif;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* --- Header Section --- */
.header-banner {
  background-color: #0d47a1; /* Warna biru gelap dari home page */
  padding: 10px 0;
  color: white;
  text-align: center;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px; /* Jarak antara grup logo dan teks SNPMB */
  box-sizing: border-box;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 10px; /* Jarak antar logo di header */
  flex-shrink: 0;
  padding-left: 15px; /* Sedikit padding di kiri agar tidak terlalu mepet */
}

.logo-small {
  width: 45px; /* Ukuran logo yang lebih kecil untuk header */
  height: 45px;
  vertical-align: middle;
}

.snpmb-text {
  text-align: left;
  flex-grow: 1;
  max-width: 70%;
  padding-right: 15px; /* Sedikit padding di kanan */
}

.snpmb-main-text {
  font-size: 1.6em;
  font-weight: bold;
  display: block;
  line-height: 1.2; /* Menjaga jarak antar baris */
}

.snpmb-sub-text {
  font-size: 0.7em;
  display: block;
  line-height: 1.2;
}

/* --- Content Wrapper and Card Section --- */
.content-wrapper {
  position: relative;
  margin-top: 70px; /* Sesuaikan dengan tinggi header */
  flex-grow: 1; /* Memastikan content-wrapper mengambil sisa ruang vertikal */
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center; /* Memusatkan content-card di tengah */
  padding: 20px; /* Padding untuk mencegah card terlalu mepet ke tepi */
  box-sizing: border-box;
}

.content-card {
  background-color: #2c2c2c; /* Warna card gelap dari home page */
  color: #e0e0e0;
  width: 90%;
  max-width: 900px; /* Max width sama dengan home page */
  padding: 30px; /* Padding internal card */
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  text-align: center; /* Pusatkan teks di dalam card */
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Pusatkan konten jika ada ruang lebih */
  height: auto; /* Biarkan tinggi menyesuaikan konten */
  max-height: calc(100vh - 140px); /* Pastikan card tidak melebihi tinggi layar - header - padding */
  overflow-y: auto; /* Scroll jika konten melebihi max-height */
}

.content-card .title {
  font-size: 2em;
  margin-bottom: 5px; /* Kurangi margin antar judul */
  color: #f0f0f0;
}

.content-card .title.sub-title {
  font-size: 1.5em; /* Judul kedua lebih kecil */
  margin-bottom: 25px;
  color: #e0e0e0;
}

.instruction-text {
  font-size: 1em;
  color: #b0b0b0;
  margin-bottom: 30px;
}

/* --- Countdown Timer Styles (Adapted for Home Page Look) --- */
.countdown-timer-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* Memungkinkan wrap pada layar kecil */
  gap: 20px; /* Jarak antar kotak timer */
  margin-bottom: 30px;
  width: 100%;
  max-width: 700px; /* Batasi lebar container timer */
}

.timer-box {
  background-color: #0d47a1; /* Warna biru gelap dari header/button */
  color: white;
  padding: 20px 30px; /* Padding disesuaikan */
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px; /* Min width untuk setiap kotak */
  flex: 1; /* Memungkinkan kotak untuk mengisi ruang */
  box-sizing: border-box;
}

.timer-box .value {
  font-size: 3.5em; /* Ukuran font nilai lebih kecil */
  line-height: 1.2;
  margin-bottom: 5px;
}

.timer-box .label {
  font-size: 1em; /* Ukuran font label lebih kecil */
  text-transform: uppercase;
}

.announcement-time {
  font-size: 1em; /* Ukuran font lebih kecil */
  color: #a0a0a0; /* Warna abu-abu yang konsisten */
  margin-top: 20px;
  margin-bottom: 30px;
}

/* --- Button Styles (Using submit-button from home page) --- */
.submit-button {
  background-color: #2196F3;
  color: white;
  padding: 12px 25px; /* Ukuran tombol disesuaikan */
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  width: auto;
  min-width: 200px; /* Min width untuk tombol */
  display: inline-block;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button:hover {
  background-color: #1976D2;
  transform: translateY(-2px);
}

/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
  .header-banner {
    height: 60px;
    gap: 10px;
  }
  .logo-group {
    padding-left: 10px;
  }
  .logo-small {
    width: 35px;
    height: 35px;
  }
  .snpmb-main-text {
    font-size: 1.3em;
  }
  .snpmb-sub-text {
    font-size: 0.6em;
  }

  .content-wrapper {
    margin-top: 60px;
    max-height: calc(100vh - 120px);
    padding: 15px;
  }

  .content-card {
    padding: 20px;
    width: 95%;
  }

  .content-card .title {
    font-size: 1.8em;
    margin-bottom: 2px;
  }
  .content-card .title.sub-title {
    font-size: 1.3em;
    margin-bottom: 20px;
  }
  .instruction-text {
    font-size: 0.9em;
    margin-bottom: 25px;
  }

  .countdown-timer-container {
    gap: 15px;
  }
  .timer-box {
    padding: 18px 25px;
    min-width: 80px;
  }
  .timer-box .value {
    font-size: 3em;
  }
  .timer-box .label {
    font-size: 0.9em;
  }

  .announcement-time {
    font-size: 0.9em;
    margin-bottom: 25px;
  }

  .submit-button {
    padding: 10px 20px;
    font-size: 1.1em;
    min-width: 160px;
  }
}

@media (max-width: 480px) {
  .header-banner {
    height: auto; /* Biarkan tinggi menyesuaikan konten */
    padding: 8px 0;
    flex-direction: column; /* Tumpuk logo dan teks */
    gap: 5px;
  }
  .logo-group {
    padding-left: 0;
    justify-content: center; /* Pusatkan logo saat ditumpuk */
    margin-bottom: 5px;
  }
  .logo-small {
    width: 30px;
    height: 30px;
    margin: 0 5px;
  }
  .snpmb-text {
    max-width: 90%; /* Izinkan teks lebih lebar */
    padding-right: 0;
    text-align: center; /* Pusatkan teks */
  }
  .snpmb-main-text {
    font-size: 1em;
  }
  .snpmb-sub-text {
    font-size: 0.55em;
  }

  .content-wrapper {
    margin-top: calc(80px + (100% - 300px) / 20); /* Penyesuaian dinamis */
    max-height: calc(100vh - 120px);
    padding: 10px;
  }

  .content-card {
    padding: 15px;
  }

  .content-card .title {
    font-size: 1.4em;
  }
  .content-card .title.sub-title {
    font-size: 1.1em;
    margin-bottom: 15px;
  }
  .instruction-text {
    font-size: 0.8em;
    margin-bottom: 20px;
  }

  .countdown-timer-container {
    flex-direction: column; /* Tumpuk kotak timer */
    gap: 10px;
    max-width: 250px; /* Batasi lebar agar tidak terlalu besar */
  }
  .timer-box {
    padding: 15px 20px;
    min-width: unset; /* Hapus min-width */
    width: 100%; /* Ambil lebar penuh */
  }
  .timer-box .value {
    font-size: 2.8em;
  }
  .timer-box .label {
    font-size: 0.8em;
  }

  .announcement-time {
    font-size: 0.8em;
    margin-bottom: 20px;
  }

  .submit-button {
    padding: 8px 15px;
    font-size: 1em;
    min-width: 120px;
  }
}
</style>