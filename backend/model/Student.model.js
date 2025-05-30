const dbPool = require('../db');

const Student = {
    findByNisnAndTanggalLahir: async (nisn, tanggalLahir) => {
        let connection;
        try {
            connection = await dbPool.getConnection();
            const [rows] = await connection.execute(
                `SELECT nisn, nama_lengkap, tanggal_lahir, kelas, asal_sekolah, kabupaten, provinsi, is_lulus
                 FROM ks_student
                 WHERE nisn = ? AND tanggal_lahir = ?`,
                [nisn, tanggalLahir]
            );
            return rows[0];

        } catch (error) {
            console.error('Error in StudentModel.findByNisnAndTanggalLahir:', error.message);
            throw new Error('Could not retrieve student data from database.'); // Pesan error generik untuk keamanan
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
}

module.exports = Student;