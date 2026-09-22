const express = require('express');
const router = express.Router();
const queueService = require('../services/queueService');

// Añadir tarea a la cola
router.post('/add', async (req, res) => {
    try {
        const { type, data, priority = 'normal' } = req.body;
        const job = await queueService.addJob(type, data, priority);
        res.json({ success: true, jobId: job.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener estado de la cola
router.get('/status', async (req, res) => {
    try {
        const status = await queueService.getQueueStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener información de un job específico
router.get('/job/:jobId', async (req, res) => {
    try {
        const job = await queueService.getJob(req.params.jobId);
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancelar job
router.delete('/job/:jobId', async (req, res) => {
    try {
        await queueService.cancelJob(req.params.jobId);
        res.json({ success: true, message: 'Job cancelado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Procesar cola manualmente
router.post('/process', async (req, res) => {
    try {
        await queueService.processQueue();
        res.json({ success: true, message: 'Cola procesada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Limpiar cola
router.post('/clean', async (req, res) => {
    try {
        await queueService.cleanQueue();
        res.json({ success: true, message: 'Cola limpiada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
