const express = require('express');
const cors = require('cors');
const resultRoutes = require('./routes/resultRoutes.routes');
const config = require('./config');

const app = express();
const PORT = config.port;

const  corsOptions = {
    origin : config.corsOrigin,
    methods : 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials : true,
    optionsSuccessStatus : 204,
}

app.use(cors(corsOptions));

app.use(express.json());

console.log(`Starting backend in ${config.env} environment...`);

app.use('/api', resultRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    // Di produksi, jangan berikan detail error sensitif ke klien
    const statusCode = err.statusCode || 500;
    const message = config.env === 'production' ? 'Internal Server Error' : err.message;
    res.status(statusCode).send(message);
});
// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on ${config.corsOrigin} (Port: ${PORT})`);
});

// Penting: Memastikan pool database terinisialisasi
require('./db');