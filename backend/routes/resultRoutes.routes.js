const express = require('express');
const router = express.Router(); // Menginisialisasi router Express
const resultController = require('../controller/Student.controller'); // Mengimpor controller yang menangani logika bisnis


router.post('/checkGraduation', resultController.resultAnnouce);
router.get('/checkAPI', resultController.check_api);

module.exports = router;