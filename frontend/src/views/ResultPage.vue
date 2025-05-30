<template>
  <div class="result-page-container">
    <div class="header-banner">
      <img src="../assets/Spensa.png" alt="Logo" class="kemendikbud-logo">
      <div class="snpmb-text">
        <span class="snpmb-main-text">PENGUMUMAN KELULUSAN</span>
        <span class="snpmb-sub-text">SMP NEGERI 1 SRAGEN</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div v-if="studentResult"
           class="result-card"
           :class="{ 'status-lulus': studentResult.isLulus, 'status-tidak-lulus': !studentResult.isLulus }"
      >
        <div class="card-header">
          <span class="status-message">
            <template v-if="studentResult.isLulus">SELAMAT! ANDA DINYatakan LULUS</template>
            <template v-else>MOHON MAAF, ANDA DINYatakan TIDAK LULUS</template>
          </span>
          <img src="../assets/Sragen.png" alt="Sragen Logo" class="sragen-logo">
        </div>

        <div class="card-body">
          <div class="qr-code-section">
            <img src="https://via.placeholder.com/120x120?text=QR+Code" alt="QR Code" class="qr-code-placeholder">
          </div>

          <div class="main-info">
            <p class="id-numbers">NISN {{ studentResult.nisn }}</p>
            <h2 class="student-name">{{ studentResult.namaLengkap }}</h2>
            <p class="student-class">Kelas: {{ studentResult.kelas }}</p>
          </div>

          <div class="detail-info">
            <div class="info-group">
              <span class="info-label">Tanggal Lahir</span>
              <span class="info-value">{{ formattedTanggalLahir }}</span>
            </div>
            <div class="info-group">
              <span class="info-label">Asal Sekolah</span>
              <span class="info-value">{{ studentResult.asalSekolah }}</span>
            </div>
            <div class="info-group">
              <span class="info-label">Kabupaten/Kota</span>
              <span class="info-value">{{ studentResult.kabupatenKota }}</span>
            </div>
            <div class="info-group">
              <span class="info-label">Provinsi</span>
              <span class="info-value">{{ studentResult.provinsi }}</span>
            </div>
          </div>

          <div class="registration-info">
            <p class="registration-instruction">
              <template v-if="studentResult.isLulus">
                Silakan klik dibawah ini untuk informasi selanjutnya <br>
                Informasi lebih lanjut dapat dilihat pada tautan berikut:
              </template>
              <template v-else>
                Informasi mengenai jalur lain atau program lanjutan dapat dilihat pada tautan berikut:
              </template>
            </p>
            <button
                @click="showInfoPopup"
                class="registration-link"
                :class="{ 'link-success': studentResult.isLulus, 'link-danger': !studentResult.isLulus }"
            >
              <template v-if="studentResult.isLulus">INFO KELULUSAN SELANJUTNYA</template>
              <template v-else>Informasi Kelulusan Lebih Lanjut Klik Dibawah Ini</template>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-data-card">
        <p>Data hasil kelulusan tidak ditemukan.</p>
        <p>Mohon kembali ke halaman utama dan masukkan data Anda.</p>
        <button @click="goToHome" class="back-button">Kembali ke Halaman Utama</button>
      </div>
    </div>

    <div v-if="showPopup" class="modal-overlay" @click.self="closeInfoPopup">
      <div class="modal-content">
        <button class="modal-close-button" @click="closeInfoPopup">&times;</button>
        <h3 class="modal-title">Informasi Selanjutnya</h3>
        <div class="modal-body">
          <template v-if="studentResult && studentResult.isLulus">
            <p>Selamat! Anda telah dinyatakan LULUS dari SMP Negeri 1 Sragen.</p>
            <p>Untuk informasi selanjutnya mengenai pengambilan Surat Keterangan Lulus (SKL), legalisir, dan pendaftaran ke jenjang SMA/SMK, harap perhatikan jadwal dan lokasi berikut:</p>
            <ul>
              <li>**Pengambilan SKL:** Tanggal **10 Juni 2025**, Pukul **09.00 - 12.00 WIB**, di Ruang Tata Usaha.</li>
              <li>**Legalisisr Ijazah:** Dapat dilakukan mulai tanggal **15 Juni 2025** di Ruang Tata Usaha.</li>
              <li>**Informasi PPDB Lanjut:** Kunjungi situs resmi Dinas Pendidikan Kabupaten Sragen di <a href="https://disdik.sragenkab.go.id" target="_blank">disdik.sragenkab.go.id</a> atau grup WhatsApp kelas Anda.</li>
            </ul>
            <p>Pastikan Anda membawa kartu ujian kelulusan atau kartu identitas saat pengambilan SKL.</p>
            <p>Kami mengucapkan selamat dan sukses selalu untuk langkah Anda selanjutnya!</p>
          </template>
          <template v-else-if="studentResult && !studentResult.isLulus">
            <p>Mohon maaf, berdasarkan hasil evaluasi akhir, Anda dinyatakan TIDAK LULUS.</p>
            <p>Kami memahami bahwa ini adalah berita yang sulit. Namun, ada beberapa pilihan dan informasi yang dapat Anda pertimbangkan:</p>
            <ul>
              <li>**Program Paket C:** Informasi mengenai program pendidikan kesetaraan (Paket C) dapat diperoleh melalui Pusat Kegiatan Belajar Masyarakat (PKBM) terdekat atau Dinas Pendidikan Kabupaten Sragen.</li>
              <li>**Konseling:** Anda dapat menghubungi guru BK atau pihak sekolah untuk sesi konseling dan diskusi mengenai langkah-langkah pendidikan selanjutnya.</li>
              <li>**Jalur Lain:** Pelajari opsi pendidikan dan pelatihan keterampilan yang mungkin sesuai dengan minat dan bakat Anda.</li>
            </ul>
            <p>Jangan patah semangat. Ada banyak jalan menuju kesuksesan. Kami siap membantu Anda mencari solusi terbaik.</p>
          </template>
          <template v-else>
            <p>Informasi tidak tersedia. Mohon kembali ke halaman utama.</p>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import moment from 'moment';
import 'moment/locale/id';

moment.locale('id');

const router = useRouter();
const toast = useToast();
const studentResult = ref(null);
const showPopup = ref(false); // Variabel untuk mengontrol visibilitas pop-up

const loadResultData = () => {
  const storedResult = localStorage.getItem('studentResult');

  if (storedResult) {
    try {
      studentResult.value = JSON.parse(storedResult);
    } catch (e) {
      console.error("Failed to parse studentResult from localStorage:", e);
      studentResult.value = null;
      toast.error('Gagal memuat data hasil dari penyimpanan lokal.');
      router.push({ name: 'Home' });
    }
  } else {
    toast.error('Data hasil kelulusan tidak ditemukan. Silakan coba lagi.');
    router.push({ name: 'Home' });
  }
};

const goToHome = () => {
  localStorage.removeItem('studentResult');
  router.push({ name: 'Home' });
};

const formattedTanggalLahir = computed(() => {
  if (studentResult.value && studentResult.value.tanggalLahir) {
    return moment(studentResult.value.tanggalLahir).format('DD MMMM[BMP]'); // Menggunakan format yang cocok dengan DB
  }
  return '';
});

// Fungsi untuk menampilkan pop-up
const showInfoPopup = () => {
  showPopup.value = true;
  // Opsional: nonaktifkan scroll body saat pop-up aktif
  document.body.style.overflow = 'hidden';
};

// Fungsi untuk menutup pop-up
const closeInfoPopup = () => {
  showPopup.value = false;
  // Opsional: aktifkan kembali scroll body
  document.body.style.overflow = '';
};

onMounted(() => {
  loadResultData();

  // Atur style global untuk body dan html
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  // Kembalikan style global saat komponen tidak lagi digunakan
  document.documentElement.style.height = '';
  document.body.style.height = '';
  document.body.style.margin = '';
  document.body.style.padding = '';
  document.body.style.overflow = '';
  // Pastikan pop-up tertutup saat komponen di-unmount
  if (showPopup.value) {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* NOTE: html, body styles are handled via JS in onMounted/onUnmounted. */

.result-page-container {
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: Arial, sans-serif;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* --- Header Section --- */
.header-banner {
  background-color: #0d47a1;
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
  gap: 15px;
}

.kemendikbud-logo {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  padding-right: 0;
}

.snpmb-text {
  text-align: left;
  flex-grow: 1;
  max-width: 70%;
}

.snpmb-main-text {
  font-size: 1.6em;
  font-weight: bold;
  display: block;
}

.snpmb-sub-text {
  font-size: 0.7em;
  display: block;
}

/* --- Content Wrapper and Result Card --- */
.content-wrapper {
  position: relative;
  margin-top: 70px; /* Offset for fixed header */
  flex-grow: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px; /* Padding untuk memberi ruang di sekitar kartu */
  box-sizing: border-box;
  overflow-y: auto; /* Izinkan content-wrapper scroll jika isinya terlalu panjang */
}

.result-card, .no-data-card {
  background-color: #000;
  color: #fff;
  width: 95%;
  max-width: 900px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: auto; /* Biarkan tinggi menyesuaikan konten */
  overflow: hidden; /* Sembunyikan overflow di result-card itu sendiri, card-body yang akan scroll */
  transition: border-color 0.3s ease;
}

.no-data-card {
  padding: 30px;
  text-align: center;
}

.no-data-card p {
  margin-bottom: 15px;
  font-size: 1.1em;
}

.no-data-card .back-button {
  background-color: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.no-data-card .back-button:hover {
  background-color: #1976D2;
  transform: translateY(-2px);
}

/* Status Styling (Lulus/Tidak Lulus) */
.result-card.status-lulus {
  border: 2px solid #0d47a1; /* Biru untuk lulus */
}

.result-card.status-tidak-lulus {
  border: 2px solid #D32F2F; /* Merah untuk tidak lulus */
}

.result-card.status-lulus .card-header {
  background-color: #0d47a1; /* Biru untuk lulus */
}

.result-card.status-tidak-lulus .card-header {
  background-color: #D32F2F; /* Merah untuk tidak lulus */
}

.card-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex-shrink: 0;
}

.status-message {
  font-size: 1.3em;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  flex-grow: 1;
  text-align: left;
}

.sragen-logo {
  height: 40px;
  flex-shrink: 0;
}

.card-body {
  flex-grow: 1;
  padding: 20px;
  display: grid;
  grid-template-areas:
    "qr-code main-info"
    "detail-info detail-info"
    "registration registration";
  grid-template-columns: 150px 1fr;
  gap: 15px 25px;
  align-items: start;
  text-align: left;
  overflow-y: auto; /* Izinkan scroll di sini jika konten melebihi tinggi */
  position: relative;
}

.qr-code-section {
  grid-area: qr-code;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5px;
}

.qr-code-placeholder {
  width: 120px;
  height: 120px;
  background-color: #fff;
  border: 1px solid #555;
  border-radius: 5px;
  flex-shrink: 0;
}

.main-info {
  grid-area: main-info;
  padding-left: 5px;
}

.id-numbers {
  font-size: 0.8em;
  color: #b0b0b0;
  margin-bottom: 3px;
}

.student-name {
  font-size: 2em;
  font-weight: bold;
  color: #fff;
  margin-bottom: 3px;
  line-height: 1.2;
}

.student-class {
  font-size: 1em;
  color: #e0e0e0;
  margin-bottom: 3px;
}

.detail-info {
  grid-area: detail-info;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 20px;
  margin-top: 15px;
  padding: 0 5px;
}

.info-group {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.75em;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.info-value {
  font-size: 0.9em;
  color: #f0f0f0;
  font-weight: bold;
}

.registration-info {
  grid-area: registration;
  margin-top: 20px;
  padding: 0 5px;
  text-align: center;
}

.registration-instruction {
  font-size: 0.85em;
  color: #b0b0b0;
  line-height: 1.4;
  margin-bottom: 12px;
  text-align: left;
}

.registration-link {
  width: 100%;
  display: inline-block;
  color: white;
  padding: 9px 18px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer; /* Tambahkan cursor pointer */
  transition: background-color 0.3s ease;
  border: none; /* Pastikan tidak ada border bawaan button */
  text-align: center;
}

.registration-link.link-success {
  background-color: #4CAF50;
}

.registration-link.link-success:hover {
  background-color: #45a049;
}

.registration-link.link-danger {
  background-color: #D32F2F;
}

.registration-link.link-danger:hover {
  background-color: #B71C1C;
}

/* --- Pop-up / Modal Styles --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Warna overlay gelap */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* Pastikan di atas semua elemen lain */
  backdrop-filter: blur(5px); /* Efek blur pada background */
}

.modal-content {
  background-color: #2c2c2c;
  color: #e0e0e0;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px; /* Lebar maksimum pop-up */
  max-height: 80vh; /* Tinggi maksimum pop-up, agar bisa scroll */
  overflow-y: auto; /* Izinkan scroll jika konten pop-up terlalu panjang */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  animation: slide-in 0.3s ease-out forwards; /* Animasi muncul */
}

.modal-close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2em;
  color: #aaa;
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal-close-button:hover {
  color: #fff;
}

.modal-title {
  font-size: 1.8em;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
}

.modal-body {
  font-size: 1em;
  line-height: 1.6;
  text-align: left;
}

.modal-body p {
  margin-bottom: 1em;
}

.modal-body ul {
  margin: 1em 0;
  padding-left: 20px;
}

.modal-body li {
  margin-bottom: 0.5em;
}

.modal-body a {
  color: #64B5F6; /* Warna link di dalam pop-up */
  text-decoration: none;
  transition: color 0.2s ease;
}

.modal-body a:hover {
  color: #90CAF9;
  text-decoration: underline;
}

/* Animasi Pop-up */
@keyframes slide-in {
  from {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
  .header-banner {
    height: 60px;
    gap: 10px;
  }
  .kemendikbud-logo {
    width: 45px;
    height: 45px;
  }
  .snpmb-main-text {
    font-size: 1.3em;
  }
  .snpmb-sub-text {
    font-size: 0.65em;
  }

  .content-wrapper {
    margin-top: 60px;
    padding: 15px;
  }

  .result-card, .no-data-card {
    min-height: 350px;
  }

  .card-header {
    padding: 10px 15px;
  }
  .status-message {
    font-size: 0.9em;
  }
  .sragen-logo {
    height: 30px;
  }

  .card-body {
    grid-template-areas:
      "main-info"
      "qr-code"
      "detail-info"
      "registration";
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 15px;
    text-align: center;
  }

  .qr-code-section {
    order: 2;
    padding-top: 0;
    justify-content: center;
  }

  .qr-code-placeholder {
    width: 100px;
    height: 100px;
  }

  .main-info {
    order: 1;
    padding-left: 0;
  }
  .student-name {
    font-size: 1.6em;
  }
  .student-class {
    font-size: 0.9em;
  }

  .detail-info {
    order: 3;
    grid-template-columns: 1fr;
    gap: 8px;
    margin-top: 12px;
    padding: 0;
    text-align: center;
  }

  .info-label {
    font-size: 0.7em;
  }
  .info-value {
    font-size: 0.85em;
  }

  .registration-info {
    order: 4;
    margin-top: 15px;
    padding: 0;
  }
  .registration-instruction {
    font-size: 0.8em;
    margin-bottom: 10px;
  }
  .registration-link {
    padding: 7px 14px;
    font-size: 0.8em;
  }

  .modal-content {
    padding: 20px;
    max-width: 90%;
  }
  .modal-title {
    font-size: 1.5em;
  }
  .modal-body {
    font-size: 0.9em;
  }
  .modal-close-button {
    font-size: 1.8em;
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .header-banner {
    height: auto;
    padding: 6px 0;
  }
  .kemendikbud-logo {
    width: 30px;
    height: 30px;
  }
  .snpmb-main-text {
    font-size: 1em;
  }
  .snpmb-sub-text {
    font-size: 0.55em;
  }

  .content-wrapper {
    margin-top: 40px;
    padding: 10px;
  }

  .result-card, .no-data-card {
    border-radius: 8px;
    border-width: 1px;
    min-height: 280px;
  }

  .card-header {
    padding: 8px 10px;
  }
  .status-message {
    font-size: 0.8em;
  }
  .sragen-logo {
    height: 25px;
  }

  .card-body {
    padding: 10px;
    gap: 8px;
  }

  .qr-code-placeholder {
    width: 80px;
    height: 80px;
  }

  .student-name {
    font-size: 1.3em;
  }
  .student-class {
    font-size: 0.85em;
  }

  .detail-info {
    gap: 6px;
    margin-top: 10px;
  }

  .info-label {
    font-size: 0.65em;
  }
  .info-value {
    font-size: 0.75em;
  }

  .registration-info {
    margin-top: 12px;
  }
  .registration-instruction {
    font-size: 0.75em;
    margin-bottom: 8px;
  }
  .registration-link {
    padding: 6px 10px;
    font-size: 0.75em;
  }

  .modal-content {
    padding: 15px;
  }
  .modal-title {
    font-size: 1.3em;
    margin-bottom: 15px;
  }
  .modal-body {
    font-size: 0.8em;
  }
  .modal-close-button {
    font-size: 1.5em;
  }
}
</style>