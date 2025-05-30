<template>
  <div class="home-page">
    <div class="header-banner">
      <img src="../assets/Spensa.png" alt="Logo" class="kemendikbud-logo">
      <div class="snpmb-text">
        <span class="snpmb-main-text">SMP NEGERI 1 SRAGEN</span>
        <span class="snpmb-sub-text">Pengumuman Kelulusan Tahun Ajaran 2024/2025</span>
        <span class="snpmb-sub-text">Dinas Pendidikan dan Kebudayaan Kab. Sragen</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="content-card">
        <h1 class="title">PENGUMUMAN KELULUSAN TAHUN AJARAN 2024/2025</h1>

        <p class="instruction-text">
          Masukkan nomor NISN dan tanggal lahir Anda.
        </p>

        <form @submit.prevent="checkResult" class="input-form">
          <div class="form-group">
            <label for="nomorPeserta" class="form-label">Nomor Induk Siswa Nasional (NISN)</label>
            <input
                type="text"
                id="nomorPeserta"
                v-model="nomorPeserta"
                class="form-input"
                placeholder="Masukkan 10 Digit Nomor Induk Siswa Nasional (NISN) Anda."
                maxlength="10"
                minlength="10"
                required
                @keypress="isNumber($event)"
            />
          </div>

          <div class="form-group date-input-group">
            <label class="form-label">Tanggal lahir</label>
            <div class="date-inputs">
              <input
                  type="text"
                  id="day"
                  v-model="day"
                  class="form-input date-input-lg"
                  placeholder="Tanggal"
                  maxlength="2"
                  pattern="\d{1,2}"
                  required
                  @keypress="isNumber($event)"
              />

              <input
                  type="text"
                  id="month"
                  v-model="month"
                  class="form-input date-input-lg"
                  placeholder="Bulan"
                  maxlength="2"
                  pattern="\d{1,2}"
                  required
                  @keypress="isNumber($event)"
              />
              <input
                  type="text"
                  id="year"
                  v-model="year"
                  class="form-input date-input-lg"
                  placeholder="Tahun"
                  maxlength="4"
                  pattern="\d{4}"
                  required
                  @keypress="isNumber($event)"
              />
            </div>
            <div class="date-hints">
              <span>Tanggal (2 digit: 01-31)</span>
              <span>Bulan (2 digit: 01-12)</span>
              <span>Tahun (4 digit)</span>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <input type="checkbox" id="declaration" v-model="declarationChecked" required class="form-checkbox" />
            <label for="declaration" class="checkbox-label">
              Dengan ini saya menyatakan bahwa apabila di kemudian hari ditemukan pelanggaran sebelum hari kelulusan, maka status kelulusan saya dibatalkan.
            </label>
          </div>

          <button :disabled="isLoading || !isFormValid" type="submit" class="submit-button">
            {{ isLoading ? 'Memoproses...' : 'Cek hasil' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue';
import moment from 'moment';
import {useRouter} from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";
import ResultPage from "./ResultPage.vue";

const router = useRouter();
const toast = useToast();

const nomorPeserta = ref('');
const day = ref('');
const month = ref('');
const year = ref('');
const declarationChecked = ref(false);
const isLoading = ref(false);


const isNumber = (event) => {
  if (!/\d/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
  }
};

const isFormValid = computed(() => {
  const isNisnValid = nomorPeserta.value.length === 10 && /^\d{10}$/.test(nomorPeserta.value);
  const isDayValid = day.value !== '' && parseInt(day.value) >= 1 && parseInt(day.value) <= 31;
  const isMonthValid = month.value !== '' && parseInt(month.value) >= 1 && parseInt(month.value) <= 12;
  const isYearValid = year.value.length === 4 && parseInt(year.value) >= 1900 && parseInt(year.value) <= new Date().getFullYear();
  const isDeclarationChecked = declarationChecked.value; // PENTING: Pindahkan deklarasi ke sini

  let isFullDateValid = false;
  let dateStringForMoment = ''; // Deklarasi di sini agar bisa di-log di luar if

  if (isDayValid && isMonthValid && isYearValid) {
    const formattedDay = String(day.value).padStart(2, '0');
    const formattedMonth = String(month.value).padStart(2, '0');
    dateStringForMoment = `${formattedDay}-${formattedMonth}-${year.value}`;

    // Debugging: Lihat string yang akan divalidasi oleh moment
    console.log(`DEBUG: Date String for Moment.js: "${dateStringForMoment}"`);
    // Validasi ketat: 'true' memastikan format harus sesuai persis
    isFullDateValid = moment(dateStringForMoment, 'DD-MM-YYYY', true).isValid();
    console.log(`DEBUG: Result of moment.isValid() for "${dateStringForMoment}": ${isFullDateValid}`);
  } else {
    console.log('DEBUG: Skipping full date validation because Day, Month, or Year is not yet valid.');
  }

  // Debugging logs untuk isFormValid
  console.log('--- Form Validation Status ---');
  console.log('NISN Valid:', isNisnValid, '(', nomorPeserta.value, ')');
  console.log('Day Valid:', isDayValid, '(', day.value, ')');
  console.log('Month Valid:', isMonthValid, '(', month.value, ')');
  console.log('Year Valid:', isYearValid, '(', year.value, ')');
  console.log('Full Date String:', dateStringForMoment); // Menampilkan string lengkap
  console.log('Full Date Valid (Moment.js):', isFullDateValid);
  console.log('Declaration Checked:', isDeclarationChecked);
  console.log('Overall Form Valid:', isNisnValid && isDayValid && isMonthValid && isYearValid && isFullDateValid && isDeclarationChecked);
  console.log('----------------------------');


  return isNisnValid && isDayValid && isMonthValid && isYearValid && isFullDateValid && isDeclarationChecked;
});

const checkResult = async () => {

  console.log('checkResult function called!');
  console.log('Sending request to API...');
  console.log('Payload:', {
    nisn: nomorPeserta.value,
    tanggal_lahir: day.value,
    bulan_lahir: month.value,
    tahun_lahir: year.value,
  });
  if(!isFormValid.value){
    toast.error("Mohon Lengkapi Semua Data Terlebih dahulu dan setujui pernyataan")
    return;
  }

  isLoading.value = true;

  try{
    const response = await axios.post('http://localhost:5277/api/checkGraduation', {
      nisn: nomorPeserta.value,
      tanggal_lahir: day.value,
      bulan_lahir: month.value,
      tahun_lahir: year.value,
    });
    console.log(response.data);
    localStorage.setItem('studentResult', JSON.stringify(response.data));
    await router.push({name: "ResultPage", query : { from : 'input'}});

  }catch (error){
    let errorMessage = 'Terjadi kesalahan saat mengecek hasil.';
    if (error.response) {
      toast.error(error.response.data.message || 'Terjadi kesalahan pada server.');
    } else if (error.request) {
      toast.error('Tidak dapat terhubung ke server backend. Pastikan server berjalan dan terjangkau.');
    }
    toast.error(error.message);
    console.error('Error checking result:', error);
  }

};

onMounted(() => {
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';

});

onUnmounted(() => {
  document.documentElement.style.height = '';
  document.body.style.height = '';
  document.body.style.margin = '';
  document.body.style.padding = '';
  document.body.style.overflow = '';

});
</script>

<style scoped>
/* NOTE: html, body styles are handled via JS in onMounted/onUnmounted. */

.home-page {
  width: 100vw;
  height: 111vh;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-family: Arial, sans-serif;
  text-align: center;
  box-sizing: border-box;
  position: relative;
}

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

.content-wrapper {
  position: relative;
  margin-top: 130px;
  width: 100%;
  height: calc(100vh - 70px);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-card {
  background-color: #2c2c2c;
  color: #e0e0e0;
  width: 90%;
  max-width: 1000px;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  text-align: left;
  box-sizing: border-box;

  height: auto;
  max-height: calc(100% - 10px);
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content-card .title {
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
}
.content-card .instruction-text {
  font-size: 0.95em;
  margin-bottom: 20px;
  text-align: center;
}

.input-form {
  width: 100%;
  max-width: 600px;
}

.form-group {
  margin-bottom: 18px;
  text-align: center;
}

.form-label {
  display: block;
  font-size: 0.9em;
  color: #f0f0f0;
  margin-bottom: 6px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 12px; /* Disesuaikan: agak dibesarkan */
  border: 1px solid #555;
  background-color: #3a3a3a;
  color: #f0f0f0;
  border-radius: 6px;
  font-size: 1.1em; /* Disesuaikan: agak dibesarkan */
  box-sizing: border-box;
  display: block;
  margin: 0 auto;
}

.form-input::placeholder {
  color: #888;
}

.date-input-group .date-inputs {
  text-align: center;
  /* font-size: 0; */ /* DIHAPUS: Ini penyebab teks tidak muncul */
  display: flex;
  justify-content: center;
  gap: 8px;
}

.date-input-lg {
  width: calc(33.33% - 15px);
  padding: 14px; /* Disesuaikan: agak dibesarkan */
  border: 1px solid #555;
  background-color: #3a3a3a;
  color: #f0f0f0;
  border-radius: 6px;
  font-size: 1.2em; /* Disesuaikan: agak dibesarkan */
  box-sizing: border-box;
  flex-grow: 1;
  margin: 0;
}

.date-hints {
  text-align: center;
  font-size: 0.8em;
  color: #a0a0a0;
  margin-top: 5px;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.date-hints span {
  display: inline-block;
  width: calc(33.33% - 15px);
  text-align: center;
  margin: 0;
  font-size: 0.8em;
  flex-grow: 1;
}


.checkbox-group {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 5px;
}

.form-checkbox {
  margin-right: 8px;
  vertical-align: middle;
  transform: scale(1.0);
  accent-color: #2196F3;
  flex-shrink: 0;
}

.checkbox-label {
  font-size: 0.85em;
  color: #b0b0b0;
  line-height: 1.4;
  text-align: left;
  flex-grow: 1;
  max-width: 90%;
}

.submit-button {
  background-color: #2196F3;
  color: white;
  padding: 9px 18px; /* Disesuaikan: agak dikecilkan */
  border: none;
  border-radius: 8px;
  font-size: 1em; /* Disesuaikan: agak dikecilkan */
  font-weight: bold;
  cursor: pointer;
  width: auto;
  min-width: 140px; /* Disesuaikan: agak dikecilkan */
  display: inline-block;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button:hover {
  background-color: #1976D2;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-banner {
    padding: 8px 0;
    height: 60px;
    gap: 10px;
  }
  .kemendikbud-logo {
    width: 45px;
    height: 45px;
  }
  .snpmb-main-text {
    font-size: 1.4em;
  }
  .snpmb-sub-text {
    font-size: 0.65em;
  }

  .content-wrapper {
    margin-top: 80px;
    height: calc(100vh - 80px);
  }

  .content-card {
    padding: 18px;
    width: 95%;
    max-width: none;
    min-height: 280px;
    max-height: calc(100% - 30px);
  }

  .title {
    font-size: 1.5em;
    margin-bottom: 18px;
  }

  .instruction-text {
    font-size: 0.9em;
  }

  .input-form {
    max-width: 100%;
  }

  .form-group {
    margin-bottom: 16px;
  }
  .form-label {
    font-size: 0.85em;
    margin-bottom: 5px;
  }
  .form-input {
    padding: 10px; /* Disesuaikan untuk responsif */
    font-size: 1em; /* Disesuaikan untuk responsif */
  }
  .date-input-group .date-inputs {
    flex-wrap: wrap;
    gap: 6px;
  }
  .date-input-lg {
    width: calc(50% - 8px);
    padding: 11px; /* Disesuaikan untuk responsif */
    font-size: 1.1em; /* Disesuaikan untuk responsif */
  }
  .date-hints {
    flex-wrap: wrap;
    gap: 6px;
    font-size: 0.75em;
  }
  .date-hints span {
    width: calc(50% - 8px);
  }
  .date-hints span:nth-child(3) {
    width: 100%;
  }
  .checkbox-group {
    margin-top: 15px;
    margin-bottom: 15px;
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
  .form-checkbox {
    margin-right: 0;
    margin-bottom: 8px;
    transform: scale(0.9);
  }
  .checkbox-label {
    font-size: 0.8em;
    text-align: center;
    max-width: 95%;
  }
  .submit-button {
    padding: 7px 15px; /* Disesuaikan untuk responsif */
    font-size: 0.9em; /* Disesuaikan untuk responsif */
    min-width: 100px; /* Disesuaikan untuk responsif */
  }
}

@media (max-width: 480px) {
  .header-banner {
    height: auto;
    padding: 5px 0;
  }
  .kemendikbud-logo {
    width: 35px;
    height: 35px;
  }
  .snpmb-main-text {
    font-size: 1.1em;
  }
  .snpmb-sub-text {
    font-size: 0.6em;
  }

  .content-wrapper {
    margin-top: 70px;
    height: calc(100vh - 70px);
  }
  .content-card {
    padding: 12px;
    border-radius: 8px;
    width: 98%;
    min-height: 250px;
  }

  .title {
    font-size: 1.3em;
    margin-bottom: 15px;
  }

  .instruction-text {
    font-size: 0.85em;
    margin-bottom: 15px;
  }

  .date-input-group .date-inputs {
    flex-direction: column;
    gap: 4px;
  }
  .date-input-lg {
    width: 100%;
    padding: 9px; /* Disesuaikan untuk responsif */
    font-size: 1.05em; /* Disesuaikan untuk responsif */
  }
  .date-hints {
    flex-direction: column;
    gap: 4px;
    font-size: 0.7em;
  }
  .date-hints span {
    width: 100%;
  }
  .checkbox-group {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .form-checkbox {
    margin-right: 0;
    margin-bottom: 6px;
    transform: scale(0.8);
  }
  .checkbox-label {
    font-size: 0.75em;
  }
  .submit-button {
    width: 100%;
    padding: 6px 12px; /* Disesuaikan untuk responsif */
    font-size: 0.8em; /* Disesuaikan untuk responsif */
  }
}
</style>