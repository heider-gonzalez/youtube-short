const Queue = require('bull');
const Redis = require('redis');
const logger = require('../utils/logger');

class QueueService {
    constructor() {
        this.queues = {};
        this.redisConfig = {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379
        };
    }

    getQueue(queueName) {
        if (!this.queues[queueName]) {
            this.queues[queueName] = new Queue(queueName, {
                redis: this.redisConfig,
                defaultJobOptions: {
                    removeOnComplete: 10,
                    removeOnFail: 50,
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 5000
                    }
                }
            });

            // Configurar procesadores
            this.setupProcessors(queueName);
        }

        return this.queues[queueName];
    }

    setupProcessors(queueName) {
        const queue = this.queues[queueName];

        queue.on('completed', (job, result) => {
            logger.info(`Job completado: ${job.id} en cola ${queueName}`);
        });

        queue.on('failed', (job, err) => {
            logger.error(`Job fallido: ${job.id} en cola ${queueName}`, err);
        });

        queue.on('stalled', (job) => {
            logger.warn(`Job estancado: ${job.id} en cola ${queueName}`);
        });

        // Procesadores específicos por tipo de cola
        switch (queueName) {
            case 'video-generation':
                queue.process(async (job) => {
                    return await this.processVideoGeneration(job.data);
                });
                break;
            case 'video-upload':
                queue.process(async (job) => {
                    return await this.processVideoUpload(job.data);
                });
                break;
            case 'analytics':
                queue.process(async (job) => {
                    return await this.processAnalytics(job.data);
                });
                break;
            case 'trend-analysis':
                queue.process(async (job) => {
                    return await this.processTrendAnalysis(job.data);
                });
                break;
        }
    }

    async addJob(type, data, priority = 'normal') {
        try {
            let queueName;
            
            switch (type) {
                case 'video-generation':
                    queueName = 'video-generation';
                    break;
                case 'video-upload':
                    queueName = 'video-upload';
                    break;
                case 'analytics':
                    queueName = 'analytics';
                    break;
                case 'trend-analysis':
                    queueName = 'trend-analysis';
                    break;
                default:
                    throw new Error(`Tipo de cola desconocido: ${type}`);
            }

            const queue = this.getQueue(queueName);
            
            const job = await queue.add(data, {
                priority: this.getPriorityValue(priority),
                delay: data.delay || 0
            });

            logger.info(`Job añadido a cola ${queueName}: ${job.id}`);
            return job;

        } catch (error) {
            logger.error('Error añadiendo job a cola:', error);
            throw error;
        }
    }

    getPriorityValue(priority) {
        const priorities = {
            'high': 1,
            'normal': 5,
            'low': 10
        };
        return priorities[priority] || 5;
    }

    async processVideoGeneration(data) {
        try {
            const automationService = require('./automationService');
            
            logger.info(`Procesando generación de video para campaña: ${data.campaignId}`);
            
            const result = await automationService.generateVideoForCampaign(data.campaignId);
            
            // Añadir job de upload a la cola
            await this.addJob('video-upload', {
                videoPath: result.video_path,
                metadata: result.metadata,
                channelId: data.channelId
            }, 'normal');
            
            return result;
        } catch (error) {
            logger.error('Error procesando generación de video:', error);
            throw error;
        }
    }

    async processVideoUpload(data) {
        try {
            const youtubeService = require('./youtubeService');
            
            logger.info(`Procesando upload de video: ${data.videoPath}`);
            
            const result = await youtubeService.uploadVideo(
                data.videoPath,
                data.metadata,
                data.channelId
            );
            
            return result;
        } catch (error) {
            logger.error('Error procesando upload de video:', error);
            throw error;
        }
    }

    async processAnalytics(data) {
        try {
            // Procesar analytics del canal
            logger.info(`Procesando analytics para canal: ${data.channelId}`);
            
            // Implementar lógica de análisis
            return { success: true, message: 'Analytics procesados' };
        } catch (error) {
            logger.error('Error procesando analytics:', error);
            throw error;
        }
    }

    async processTrendAnalysis(data) {
        try {
            const youtubeService = require('./youtubeService');
            
            logger.info(`Procesando análisis de tendencias para región: ${data.region}`);
            
            const trending = await youtubeService.getTrendingVideos(data.region);
            
            // Analizar tendencias y guardar resultados
            return { success: true, trending };
        } catch (error) {
            logger.error('Error procesando análisis de tendencias:', error);
            throw error;
        }
    }

    async getQueueStatus() {
        try {
            const status = {};
            
            for (const [name, queue] of Object.entries(this.queues)) {
                const counts = await queue.getJobCounts();
                status[name] = {
                    waiting: counts.waiting || 0,
                    active: counts.active || 0,
                    completed: counts.completed || 0,
                    failed: counts.failed || 0
                };
            }
            
            return status;
        } catch (error) {
            logger.error('Error obteniendo estado de colas:', error);
            throw error;
        }
    }

    async getJob(jobId) {
        try {
            // Buscar job en todas las colas
            for (const queue of Object.values(this.queues)) {
                const job = await queue.getJob(jobId);
                if (job) {
                    return {
                        id: job.id,
                        data: job.data,
                        progress: job.progress(),
                        state: await job.getState(),
                        failedReason: job.failedReason
                    };
                }
            }
            
            throw new Error('Job no encontrado');
        } catch (error) {
            logger.error('Error obteniendo job:', error);
            throw error;
        }
    }

    async cancelJob(jobId) {
        try {
            for (const queue of Object.values(this.queues)) {
                const job = await queue.getJob(jobId);
                if (job) {
                    await job.remove();
                    logger.info(`Job cancelado: ${jobId}`);
                    return;
                }
            }
            
            throw new Error('Job no encontrado');
        } catch (error) {
            logger.error('Error cancelando job:', error);
            throw error;
        }
    }

    async processQueue() {
        try {
            for (const queue of Object.values(this.queues)) {
                // Procesar jobs pendientes
                await queue.process();
            }
            
            logger.info('Colas procesadas manualmente');
        } catch (error) {
            logger.error('Error procesando colas:', error);
            throw error;
        }
    }

    async cleanQueue() {
        try {
            for (const queue of Object.values(this.queues)) {
                await queue.clean(0, 'completed');
                await queue.clean(0, 'failed');
            }
            
            logger.info('Colas limpiadas');
        } catch (error) {
            logger.error('Error limpiando colas:', error);
            throw error;
        }
    }

    async closeAllQueues() {
        try {
            for (const queue of Object.values(this.queues)) {
                await queue.close();
            }
            
            this.queues = {};
            logger.info('Todas las colas cerradas');
        } catch (error) {
            logger.error('Error cerrando colas:', error);
            throw error;
        }
    }
}

module.exports = new QueueService();
