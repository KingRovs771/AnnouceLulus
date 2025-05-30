<template>
  <div class="p-6 bg-white shadow-md rounded-md">
    <h2 class="text-xl font-bold text-center">HASIL SELEKSI SNBP 2023</h2>
    <div class="mt-4">
      <label for="registration" class="block text-sm font-medium">Nomor Pendaftaran</label>
      <input type="text" v-model="registrationNumber" class="border p-2 w-full rounded-md" placeholder="Nomor registrasi">
    </div>
    <div class="mt-4">
      <label for="birthdate" class="block text-sm font-medium">Tanggal Lahir</label>
      <input type="date" v-model="birthdate" class="border p-2 w-full rounded-md">
    </div>
    <button @click="viewResults" class="mt-4 bg-blue-500 text-white p-2 rounded-md w-full">LIHAT HASIL SELEKSI</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const registrationNumber = ref("");
const birthdate = ref("");

const viewResults = () => {
  console.log("Nomor:", registrationNumber.value);
  console.log("Tanggal Lahir:", birthdate.value);
};
</script>
