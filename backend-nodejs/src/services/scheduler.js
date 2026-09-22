const cron = require('node-cron');
const automationService = require('./automationService');
const youtubeService = require('./youtubeService');
const logger = require('../utils/logger');

class Scheduler {
    constructor() {
        this.scheduledTasks = new Map();
        this.isInitialized = false;
    }

    initializeScheduler() {
        if (this.isInitialized) {
            logger.warn('Scheduler ya está inicializado');
            return;
        }

        // Programar generación de videos cada 6 horas
        this.scheduleVideoGeneration();

        // Programar análisis de tendencias cada día
        this.scheduleTrendAnalysis();

        // Programar optimización de metadatos cada 3 días
        this.scheduleMetadataOptimization();

        // Programar análisis de RPM y nichos cada semana
        this.scheduleRPManalysis();

        this.isInitialized = true;
        logger.info('📅 Scheduler inicializado exitosamente');
    }

    scheduleVideoGeneration() {
        // Generar videos cada 6 horas: 0 */6 * * *
        const task = cron.schedule('0 */6 * * *', async () => {
            logger.info('🎬 Iniciando generación programada de videos');
            await this.generateVideosForActiveCampaigns();
        }, {
            scheduled: false
        });

        this.scheduledTasks.set('videoGeneration', task);
        task.start();
        logger.info('✅ Tarea de generación de videos programada');
    }

    scheduleTrendAnalysis() {
        // Analizar tendencias cada día a las 3 AM: 0 3 * * *
        const task = cron.schedule('0 3 * * *', async () => {
            logger.info('📊 Iniciando análisis de tendencias');
            await this.analyzeTrends();
        }, {
            scheduled: false
        });

        this.scheduledTasks.set('trendAnalysis', task);
        task.start();
        logger.info('✅ Tarea de análisis de tendencias programada');
    }

    scheduleMetadataOptimization() {
        // Optimizar metadatos cada 3 días: 0 2 */3 * *
        const task = cron.schedule('0 2 */3 * *', async () => {
            logger.info('🔧 Iniciando optimización de metadatos');
            await this.optimizeMetadata();
        }, {
            scheduled: false
        });

        this.scheduledTasks.set('metadataOptimization', task);
        task.start();
        logger.info('✅ Tarea de optimización de metadatos programada');
    }

    scheduleRPManalysis() {
        // Analizar RPM cada domingo a las 4 AM: 0 4 * * 0
        const task = cron.schedule('0 4 * * 0', async () => {
            logger.info('💰 Iniciando análisis de RPM y nichos');
            await this.analyzeRPMAndNiches();
        }, {
            scheduled: false
        });

        this.scheduledTasks.set('rpmAnalysis', task);
        task.start();
        logger.info('✅ Tarea de análisis de RPM programada');
    }

    async generateVideosForActiveCampaigns() {
        try {
            const campaigns = await automationService.getAllCampaigns();
            const activeCampaigns = campaigns.filter(c => c.status === 'active');

            logger.info(`Procesando ${activeCampaigns.length} campañas activas`);

            for (const campaign of activeCampaigns) {
                try {
                    // Verificar si corresponde generar video según schedule
                    if (await this.shouldGenerateVideo(campaign)) {
                        logger.info(`Generando video para campaña: ${campaign.name}`);
                        
                        const result = await automationService.generateVideoForCampaign(campaign.id);
                        
                        // Programar upload para hora óptima
                        await this.scheduleUpload(campaign, result);
                    }
                } catch (error) {
                    logger.error(`Error generando video para campaña ${campaign.id}:`, error);
                }
            }
        } catch (error) {
            logger.error('Error en generación programada:', error);
        }
    }

    async shouldGenerateVideo(campaign) {
        // Lógica para determinar si corresponde generar video
        // Basado en schedule, videosPerDay, hora actual, etc.
        const now = new Date();
        const hour = now.getHours();
        
        // Ejemplo: generar videos entre 6 AM y 10 PM
        if (hour < 6 || hour > 22) {
            return false;
        }

        // Verificar cuántos videos se generaron hoy
        // (implementar lógica con base de datos)
        return true;
    }

    async scheduleUpload(campaign, videoResult) {
        try {
            // Determinar hora óptima de upload basado en analytics
            const optimalTime = await this.getOptimalUploadTime(campaign.channel_id);
            
            // Programar upload con node-cron
            const uploadTime = optimalTime || '12:00'; // Default al mediodía
            const [hours, minutes] = uploadTime.split(':');
            
            const cronExpression = `${minutes} ${hours} * * *`;
            
            const task = cron.schedule(cronExpression, async () => {
                try {
                    logger.info(`📤 Subiendo video para campaña: ${campaign.name}`);
                    
                    await youtubeService.uploadVideo(
                        videoResult.video_path,
                        videoResult.metadata,
                        campaign.channel_id
                    );
                    
                    logger.info('Video subido exitosamente');
                } catch (error) {
                    logger.error('Error subiendo video:', error);
                }
            }, {
                scheduled: false
            });

            task.start();
            logger.info(`Upload programado para las ${uploadTime}`);
            
        } catch (error) {
            logger.error('Error programando upload:', error);
        }
    }

    async getOptimalUploadTime(channelId) {
        try {
            // Analizar datos históricos del canal para encontrar mejor hora
            // Usar YouTube Analytics API
            const analytics = await youtubeService.getChannelAnalytics(channelId);
            
            // Analizar patrones de visualización por hora
            // (implementar lógica de análisis)
            
            // Por ahora retornar un valor por defecto
            return '12:00';
        } catch (error) {
            logger.error('Error obteniendo hora óptima:', error);
            return '12:00';
        }
    }

    async analyzeTrends() {
        try {
            const regions = ['US', 'ES', 'MX', 'BR', 'AR', 'DE', 'FR'];
            
            for (const region of regions) {
                try {
                    const trending = await youtubeService.getTrendingVideos(region);
                    
                    // Analizar tendencias y actualizar nichos recomendados
                    // (implementar lógica de análisis)
                    
                    logger.info(`Tendencias analizadas para región: ${region}`);
                } catch (error) {
                    logger.error(`Error analizando tendencias para ${region}:`, error);
                }
            }
        } catch (error) {
            logger.error('Error en análisis de tendencias:', error);
        }
    }

    async optimizeMetadata() {
        try {
            // Obtener videos con bajo rendimiento
            // Actualizar títulos, descripciones, tags
            // (implementar lógica de optimización)
            
            logger.info('Optimización de metadatos completada');
        } catch (error) {
            logger.error('Error en optimización de metadatos:', error);
        }
    }

    async analyzeRPMAndNiches() {
        try {
            const highRPMRegions = await automationService.getHighRPMRegions();
            const bestNiches = await automationService.getBestNiches();
            
            logger.info('Regiones con alto RPM:', highRPMRegions);
            logger.info('Mejores nichos:', bestNiches);
            
            // Guardar análisis para referencia futura
            // (implementar guardado en base de datos)
            
        } catch (error) {
            logger.error('Error en análisis de RPM:', error);
        }
    }

    async updateSchedule(scheduleConfig) {
        try {
            // Actualizar configuración de schedule
            // Reiniciar tareas con nueva configuración
            
            logger.info('Schedule actualizado:', scheduleConfig);
            return { success: true, schedule: scheduleConfig };
        } catch (error) {
            logger.error('Error actualizando schedule:', error);
            throw error;
        }
    }

    async getCurrentSchedule() {
        try {
            const schedules = {};
            
            for (const [name, task] of this.scheduledTasks) {
                schedules[name] = {
                    running: task.running || false,
                    scheduled: task.scheduled || false
                };
            }
            
            return schedules;
        } catch (error) {
            logger.error('Error obteniendo schedule actual:', error);
            throw error;
        }
    }

    stopAllTasks() {
        for (const [name, task] of this.scheduledTasks) {
            task.stop();
            logger.info(`Tarea detenida: ${name}`);
        }
        this.scheduledTasks.clear();
        this.isInitialized = false;
        logger.info('Todas las tareas del scheduler detenidas');
    }
}

module.exports = new Scheduler();
