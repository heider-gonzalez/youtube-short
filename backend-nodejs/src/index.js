require('dotenv').config();
const express = require('express');
const cors = require('cors');
const youtubeRoutes = require('./routes/youtube');
const automationRoutes = require('./routes/automation');
const queueRoutes = require('./routes/queue');
const { initializeScheduler } = require('./services/scheduler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.NODE_BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/youtube', youtubeRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/queue', queueRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'node-backend' });
});

app.get('/', (req, res) => {
    res.json({
        message: 'YouTube Automation Node.js Backend',
        version: '1.0.0',
        status: 'running'
    });
});

// Error handling
app.use((err, req, res, next) => {
    logger.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
    logger.info(`🚀 Servidor Node.js iniciado en puerto ${PORT}`);
    
    // Iniciar scheduler
    initializeScheduler();
});

module.exports = app;
