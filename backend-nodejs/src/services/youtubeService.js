const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class YouTubeService {
    constructor() {
        this.youtube = null;
        this.oauth2Client = null;
    }

    async initialize(tokens) {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );

        this.oauth2Client.setCredentials(tokens);
        this.youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
    }

    async getChannelInfo(channelId) {
        try {
            const response = await this.youtube.channels.list({
                part: 'snippet,statistics,brandingSettings',
                id: channelId
            });

            return response.data.items[0];
        } catch (error) {
            logger.error('Error obteniendo información del canal:', error);
            throw error;
        }
    }

    async uploadVideo(videoPath, metadata, channelId) {
        try {
            const fileSize = (await fs.stat(videoPath)).size;

            const response = await this.youtube.videos.insert({
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: metadata.title,
                        description: metadata.description,
                        tags: metadata.tags,
                        categoryId: metadata.categoryId || '24', // Entertainment
                        defaultLanguage: metadata.language || 'es',
                        defaultAudioLanguage: metadata.language || 'es'
                    },
                    status: {
                        privacyStatus: metadata.privacyStatus || 'public',
                        selfDeclaredMadeForKids: metadata.madeForKids || false
                    }
                },
                media: {
                    body: require('fs').createReadStream(videoPath)
                }
            }, {
                onUploadProgress: (evt) => {
                    const progress = (evt.bytesRead / fileSize) * 100;
                    logger.info(`Upload progress: ${progress.toFixed(2)}%`);
                }
            });

            logger.info('Video subido exitosamente:', response.data.id);
            return {
                success: true,
                videoId: response.data.id,
                url: `https://www.youtube.com/watch?v=${response.data.id}`
            };
        } catch (error) {
            logger.error('Error subiendo video:', error);
            throw error;
        }
    }

    async getChannelStats(channelId) {
        try {
            const response = await this.youtube.channels.list({
                part: 'statistics',
                id: channelId
            });

            return response.data.items[0].statistics;
        } catch (error) {
            logger.error('Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    async getChannelAnalytics(channelId, startDate, endDate) {
        try {
            const response = await this.youtube.reports.query({
                ids: `channel==MINE`,
                startDate: startDate || '2023-01-01',
                endDate: endDate || new Date().toISOString().split('T')[0],
                metrics: 'views,estimatedMinutesWatched,subscribersGained,subscribersLost,averageViewDuration',
                dimensions: 'day'
            });

            return response.data;
        } catch (error) {
            logger.error('Error obteniendo analytics:', error);
            throw error;
        }
    }

    async listChannelVideos(channelId, maxResults = 50) {
        try {
            const response = await this.youtube.search.list({
                part: 'snippet',
                channelId: channelId,
                maxResults: maxResults,
                order: 'date'
            });

            return response.data.items;
        } catch (error) {
            logger.error('Error listando videos:', error);
            throw error;
        }
    }

    async getTrendingVideos(regionCode = 'US', categoryId) {
        try {
            const params = {
                part: 'snippet,contentDetails,statistics',
                chart: 'mostPopular',
                regionCode: regionCode,
                maxResults: 50
            };

            if (categoryId) {
                params.videoCategoryId = categoryId;
            }

            const response = await this.youtube.videos.list(params);
            return response.data.items;
        } catch (error) {
            logger.error('Error obteniendo trending videos:', error);
            throw error;
        }
    }

    async searchVideos(query, maxResults = 25) {
        try {
            const response = await this.youtube.search.list({
                part: 'snippet',
                q: query,
                maxResults: maxResults,
                type: 'video',
                order: 'relevance'
            });

            return response.data.items;
        } catch (error) {
            logger.error('Error buscando videos:', error);
            throw error;
        }
    }

    async updateVideoMetadata(videoId, metadata) {
        try {
            const response = await this.youtube.videos.update({
                part: 'snippet,status',
                requestBody: {
                    id: videoId,
                    snippet: {
                        title: metadata.title,
                        description: metadata.description,
                        tags: metadata.tags,
                        categoryId: metadata.categoryId
                    },
                    status: {
                        privacyStatus: metadata.privacyStatus
                    }
                }
            });

            return response.data;
        } catch (error) {
            logger.error('Error actualizando metadata:', error);
            throw error;
        }
    }

    async deleteVideo(videoId) {
        try {
            await this.youtube.videos.delete({
                id: videoId
            });

            return { success: true, message: 'Video eliminado' };
        } catch (error) {
            logger.error('Error eliminando video:', error);
            throw error;
        }
    }

    async getVideoComments(videoId, maxResults = 20) {
        try {
            const response = await this.youtube.commentThreads.list({
                part: 'snippet',
                videoId: videoId,
                maxResults: maxResults,
                order: 'relevance'
            });

            return response.data.items;
        } catch (error) {
            logger.error('Error obteniendo comentarios:', error);
            throw error;
        }
    }
}

module.exports = new YouTubeService();
