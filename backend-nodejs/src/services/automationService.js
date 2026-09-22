const { Pool } = require('pg');
const logger = require('../utils/logger');
const axios = require('axios');

// Configuración de base de datos
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

class AutomationService {
    async createCampaign(campaignData) {
        try {
            const {
                name,
                channelId,
                niche,
                language,
                schedule,
                videosPerDay,
                style,
                targetAudience,
                status = 'active'
            } = campaignData;

            const query = `
                INSERT INTO campaigns 
                (name, channel_id, niche, language, schedule, videos_per_day, style, target_audience, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `;

            const values = [
                name,
                channelId,
                niche,
                language,
                JSON.stringify(schedule),
                videosPerDay,
                style,
                targetAudience,
                status
            ];

            const result = await pool.query(query, values);
            logger.info(`Campaña creada: ${result.rows[0].id}`);
            return result.rows[0];
        } catch (error) {
            logger.error('Error creando campaña:', error);
            throw error;
        }
    }

    async getAllCampaigns() {
        try {
            const result = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
            return result.rows;
        } catch (error) {
            logger.error('Error obteniendo campañas:', error);
            throw error;
        }
    }

    async getCampaign(id) {
        try {
            const result = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            logger.error('Error obteniendo campaña:', error);
            throw error;
        }
    }

    async updateCampaign(id, updateData) {
        try {
            const updates = [];
            const values = [];
            let paramCount = 1;

            for (const [key, value] of Object.entries(updateData)) {
                if (key === 'schedule') {
                    updates.push(`${key} = $${paramCount}`);
                    values.push(JSON.stringify(value));
                } else {
                    updates.push(`${key} = $${paramCount}`);
                    values.push(value);
                }
                paramCount++;
            }

            values.push(id);
            const query = `
                UPDATE campaigns 
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE id = $${paramCount}
                RETURNING *
            `;

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            logger.error('Error actualizando campaña:', error);
            throw error;
        }
    }

    async toggleCampaign(id) {
        try {
            const campaign = await this.getCampaign(id);
            const newStatus = campaign.status === 'active' ? 'paused' : 'active';
            return await this.updateCampaign(id, { status: newStatus });
        } catch (error) {
            logger.error('Error cambiando estado de campaña:', error);
            throw error;
        }
    }

    async deleteCampaign(id) {
        try {
            await pool.query('DELETE FROM campaigns WHERE id = $1', [id]);
            logger.info(`Campaña eliminada: ${id}`);
        } catch (error) {
            logger.error('Error eliminando campaña:', error);
            throw error;
        }
    }

    async generateVideoForCampaign(campaignId) {
        try {
            const campaign = await this.getCampaign(campaignId);
            
            if (campaign.status !== 'active') {
                throw new Error('La campaña no está activa');
            }

            // Llamar al backend Python para generar contenido
            const pythonBackendUrl = `http://localhost:${process.env.PYTHON_BACKEND_PORT || 8000}`;
            
            const contentResponse = await axios.post(`${pythonBackendUrl}/api/content/generate`, {
                niche: campaign.niche,
                style: campaign.style,
                language: campaign.language,
                target_audience: campaign.target_audience
            });

            const { script, visual_prompts, audio_config, metadata } = contentResponse.data;

            // Crear video
            const videoResponse = await axios.post(`${pythonBackendUrl}/api/content/create-video`, {
                script,
                visual_prompts,
                audio_config
            });

            // Guardar registro del video generado
            await this.saveGeneratedVideo(campaignId, {
                script,
                metadata,
                video_path: videoResponse.data.video_path
            });

            return {
                success: true,
                video_path: videoResponse.data.video_path,
                metadata
            };

        } catch (error) {
            logger.error('Error generando video para campaña:', error);
            throw error;
        }
    }

    async saveGeneratedVideo(campaignId, videoData) {
        try {
            const query = `
                INSERT INTO generated_videos 
                (campaign_id, script, metadata, video_path, status)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const values = [
                campaignId,
                videoData.script,
                JSON.stringify(videoData.metadata),
                videoData.video_path,
                'ready'
            ];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            logger.error('Error guardando video generado:', error);
            throw error;
        }
    }

    async getAutomationStats() {
        try {
            const campaigns = await this.getAllCampaigns();
            const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
            
            const videosResult = await pool.query(`
                SELECT COUNT(*) as total, 
                       COUNT(CASE WHEN status = 'uploaded' THEN 1 END) as uploaded,
                       COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready
                FROM generated_videos
            `);

            return {
                total_campaigns: campaigns.length,
                active_campaigns,
                total_videos: parseInt(videosResult.rows[0].total),
                uploaded_videos: parseInt(videosResult.rows[0].uploaded),
                ready_videos: parseInt(videosResult.rows[0].ready)
            };
        } catch (error) {
            logger.error('Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    async getBestNiches() {
        try {
            // Analizar datos históricos para encontrar mejores nichos
            const query = `
                SELECT c.niche, 
                       COUNT(gv.id) as videos_count,
                       AVG(gv.views) as avg_views,
                       AVG(gv.retention_rate) as avg_retention
                FROM campaigns c
                LEFT JOIN generated_videos gv ON c.id = gv.campaign_id
                WHERE c.status = 'active'
                GROUP BY c.niche
                ORDER BY avg_views DESC, avg_retention DESC
                LIMIT 10
            `;

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            logger.error('Error obteniendo mejores nichos:', error);
            throw error;
        }
    }

    async getHighRPMRegions() {
        try {
            // Lista de regiones con alto RPM (basado en datos históricos)
            return [
                { region: 'US', rpm: 15.50, language: 'en' },
                { region: 'AU', rpm: 12.30, language: 'en' },
                { region: 'CA', rpm: 11.80, language: 'en' },
                { region: 'UK', rpm: 10.90, language: 'en' },
                { region: 'DE', rpm: 9.50, language: 'de' },
                { region: 'FR', rpm: 8.20, language: 'fr' },
                { region: 'ES', rpm: 6.80, language: 'es' },
                { region: 'MX', rpm: 4.50, language: 'es' },
                { region: 'BR', rpm: 3.80, language: 'pt' },
                { region: 'AR', rpm: 3.20, language: 'es' }
            ];
        } catch (error) {
            logger.error('Error obteniendo regiones con alto RPM:', error);
            throw error;
        }
    }
}

module.exports = new AutomationService();
