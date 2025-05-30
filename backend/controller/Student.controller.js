// backend-kelulusan/controllers/resultController.js
const studentModel = require('../model/Student.model'); // Pastikan path dan nama file model sudah benar
const moment = require('moment'); // Untuk validasi dan format tanggal

// Penting: Set locale untuk moment.js agar memahami nama bulan Bahasa Indonesia
moment.locale('id'); // Tambahkan baris ini!

const StudentController = {
    resultAnnouce : async (req, res) => {
        const {nisn, tanggal_lahir, bulan_lahir, tahun_lahir} = req.body;

        // 1. Validasi Input Dasar (tipe data dan keberadaan)
        if (!nisn || !tanggal_lahir || !bulan_lahir || !tahun_lahir) {
            return res.status(400).json({
                status : 'error',
                message : 'Data Belum Lengkap'
            });
        }

        // Konversi string digit ke integer dan validasi rentang
        const day = parseInt(tanggal_lahir, 10);
        const month = parseInt(bulan_lahir, 10);
        const year = parseInt(tahun_lahir, 10);

        // 2. Validasi Nilai Numerik dan Rentang
        if (isNaN(day) || day < 1 || day > 31) {
            return res.status(400).json({ message: 'Hari lahir tidak valid. Harap masukkan angka antara 1-31.' });
        }
        if (isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ message: 'Bulan lahir tidak valid. Harap masukkan angka antara 1-12.' });
        }
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1900 || year > currentYear) {
            return res.status(400).json({ message: `Tahun lahir tidak valid. Harap masukkan angka antara 1900-${currentYear}.` });
        }

        const monthsInIndonesian = [
            '', // index 0 tidak dipakai
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const namaBulanIndonesia = monthsInIndonesian[month];
        if(!namaBulanIndonesia){ // Ini seharusnya tidak tercapai jika validasi rentang bulan sudah benar
            return res.status(400).json({
                status : 'error',
                message :'Nama Bulan Tidak Valid (Internal Error)'
            });
        }

        const fullTanggalLahirStringForMoment = `${String(day).padStart(2, '0')} ${namaBulanIndonesia} ${year}`;

        const parsedTanggalLahir = moment(fullTanggalLahirStringForMoment, 'DD MMMM YYYY', true); // <--- Hapus [BMP] di sini

        if (!parsedTanggalLahir.isValid()) {
            return res.status(400).json({
                message: "Kombinasi tanggal lahir tidak valid (misal, tanggal tidak ada di bulan tersebut).",
            });
        }

        // Format tanggal yang akan digunakan untuk query database.
        const tanggalLahirForDb = parsedTanggalLahir.format('YYYY-MM-DD'); // Pastikan format ini cocok dengan DB

        try {
            // Langsung ambil dari database, tanpa caching Redis
            const student = await studentModel.findByNisnAndTanggalLahir(
                nisn,
                tanggalLahirForDb
            );

            // 4. Penanganan Hasil Pencarian
            if (!student) {
                return res.status(404).json({ message: 'Data siswa tidak ditemukan. Pastikan NISN dan Tanggal Lahir Anda benar.' });
            }

            // 5. Format Respons Data
            const resultData = {
                nisn: student.nisn,
                namaLengkap: student.nama_lengkap,
                tanggalLahir: student.tanggal_lahir, // Menggunakan format dari DB
                kelas: student.kelas,
                asalSekolah: student.asal_sekolah,
                kabupatenKota: student.kabupaten,
                provinsi: student.provinsi,
                isLulus: student.is_lulus === 1
            };

            res.json(resultData); // Kirim data hasil ke klien

        } catch (error) {
            // 6. Penanganan Error Server
            console.error('Error in StudentController.resultAnnouce:', error.message);
            res.status(500).json({ message: 'Terjadi kesalahan pada server saat memproses permintaan Anda. Mohon coba lagi nanti.' });
        }
    },

    check_api : async (req, res) => {
        res.status(200).json({
            status : 'success',
            message : 'Berhasil Terhubung dengan API Kelulusan'
        });
    }
};

module.exports = StudentController;