const express = require('express');
const router = express.Router();
const automationService = require('../services/automationService');
const scheduler = require('../services/scheduler');

// Crear nueva campaña de automatización
router.post('/campaign', async (req, res) => {
    try {
        const campaign = await automationService.createCampaign(req.body);
        res.json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todas las campañas
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await automationService.getAllCampaigns();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener campaña por ID
router.get('/campaign/:id', async (req, res) => {
    try {
        const campaign = await automationService.getCampaign(req.params.id);
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar campaña
router.put('/campaign/:id', async (req, res) => {
    try {
        const campaign = await automationService.updateCampaign(req.params.id, req.body);
        res.json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pausar/Reanudar campaña
router.post('/campaign/:id/toggle', async (req, res) => {
    try {
        const campaign = await automationService.toggleCampaign(req.params.id);
        res.json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar campaña
router.delete('/campaign/:id', async (req, res) => {
    try {
        await automationService.deleteCampaign(req.params.id);
        res.json({ success: true, message: 'Campaña eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generar video para una campaña
router.post('/campaign/:id/generate', async (req, res) => {
    try {
        const result = await automationService.generateVideoForCampaign(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener estadísticas de automatización
router.get('/stats', async (req, res) => {
    try {
        const stats = await automationService.getAutomationStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Configurar schedule
router.post('/schedule', async (req, res) => {
    try {
        const schedule = await scheduler.updateSchedule(req.body);
        res.json({ success: true, schedule });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener schedule actual
router.get('/schedule', async (req, res) => {
    try {
        const schedule = await scheduler.getCurrentSchedule();
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
