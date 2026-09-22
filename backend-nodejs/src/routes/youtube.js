const express = require('express');
const router = express.Router();
const youtubeService = require('../services/youtubeService');
const { authenticateYouTube } = require('../services/authService');

// Autenticación con YouTube
router.post('/auth', async (req, res) => {
    try {
        const { code } = req.body;
        const tokens = await authenticateYouTube(code);
        res.json({ success: true, tokens });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener información del canal
router.get('/channel/:channelId', async (req, res) => {
    try {
        const channelData = await youtubeService.getChannelInfo(req.params.channelId);
        res.json(channelData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Subir video
router.post('/upload', async (req, res) => {
    try {
        const { videoPath, metadata, channelId } = req.body;
        const result = await youtubeService.uploadVideo(videoPath, metadata, channelId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener estadísticas del canal
router.get('/stats/:channelId', async (req, res) => {
    try {
        const stats = await youtubeService.getChannelStats(req.params.channelId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener analytics del canal
router.get('/analytics/:channelId', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const analytics = await youtubeService.getChannelAnalytics(
            req.params.channelId,
            startDate,
            endDate
        );
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar videos del canal
router.get('/videos/:channelId', async (req, res) => {
    try {
        const { maxResults = 50 } = req.query;
        const videos = await youtubeService.listChannelVideos(
            req.params.channelId,
            maxResults
        );
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener trending topics
router.get('/trending', async (req, res) => {
    try {
        const { regionCode = 'US', categoryId } = req.query;
        const trending = await youtubeService.getTrendingVideos(regionCode, categoryId);
        res.json(trending);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar videos por keywords
router.get('/search', async (req, res) => {
    try {
        const { query, maxResults = 25 } = req.query;
        const results = await youtubeService.searchVideos(query, maxResults);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
