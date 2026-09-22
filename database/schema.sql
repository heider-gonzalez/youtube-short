-- Esquema de base de datos para YouTube Automation System

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de canales
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    youtube_channel_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    niche VARCHAR(100),
    language VARCHAR(10) DEFAULT 'es',
    region VARCHAR(10) DEFAULT 'US',
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de campañas
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    niche VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'es',
    schedule JSONB,
    videos_per_day INTEGER DEFAULT 1,
    style VARCHAR(50) DEFAULT 'viral',
    target_audience TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de videos generados
CREATE TABLE generated_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    script TEXT NOT NULL,
    metadata JSONB,
    video_path TEXT,
    youtube_video_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    views INTEGER DEFAULT 0,
    watch_time_seconds INTEGER DEFAULT 0,
    retention_rate DECIMAL(5,2),
    rpm DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de analytics del canal
CREATE TABLE channel_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    watch_time_seconds INTEGER DEFAULT 0,
    subscribers_gained INTEGER DEFAULT 0,
    subscribers_lost INTEGER DEFAULT 0,
    estimated_revenue DECIMAL(10,2),
    rpm DECIMAL(10,2),
    retention_rate DECIMAL(5,2),
    ctr DECIMAL(5,2),
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(channel_id, date)
);

-- Tabla de tendencias
CREATE TABLE trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    niche VARCHAR(100) NOT NULL,
    region VARCHAR(10) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    viral_score DECIMAL(3,2),
    competition_level VARCHAR(50),
    monetization_potential VARCHAR(50),
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    data JSONB
);

-- Tabla de configuración del sistema
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de logs de generación
CREATE TABLE generation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    video_id UUID REFERENCES generated_videos(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    duration_seconds INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_campaigns_channel_id ON campaigns(channel_id);
CREATE INDEX idx_generated_videos_campaign_id ON generated_videos(campaign_id);
CREATE INDEX idx_generated_videos_status ON generated_videos(status);
CREATE INDEX idx_channel_analytics_channel_id ON channel_analytics(channel_id);
CREATE INDEX idx_channel_analytics_date ON channel_analytics(date);
CREATE INDEX idx_trends_niche_region ON trends(niche, region);
CREATE INDEX idx_generation_logs_campaign_id ON generation_logs(campaign_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_videos_updated_at BEFORE UPDATE ON generated_videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Datos iniciales de configuración
INSERT INTO system_config (key, value, description) VALUES
('max_daily_videos_per_channel', '{"value": 10}', 'Máximo de videos diarios por canal'),
('optimal_upload_times', '{"times": ["06:00", "12:00", "18:00", "21:00"]}', 'Horarios óptimos de subida'),
('high_rpm_regions', '{"regions": ["US", "AU", "CA", "UK", "DE"]}', 'Regiones con alto RPM'),
('spam_detection_enabled', '{"enabled": true}', 'Detección de spam habilitada'),
('content_quality_threshold', '{"min_retention": 50, "min_ctr": 3}', 'Umbral de calidad de contenido');

-- Datos iniciales de nichos con alto RPM
INSERT INTO trends (niche, region, topic, viral_score, competition_level, monetization_potential, expires_at) VALUES
('Finanzas', 'US', 'Inversiones para principiantes', 8.5, 'alta', 'alto', CURRENT_TIMESTAMP + INTERVAL '30 days'),
('Tecnología', 'US', 'Reviews de gadgets 2024', 9.0, 'alta', 'alto', CURRENT_TIMESTAMP + INTERVAL '30 days'),
('Marketing', 'US', 'Tips de marketing digital', 8.2, 'media', 'alto', CURRENT_TIMESTAMP + INTERVAL '30 days'),
('Educación', 'US', 'Aprende en 60 segundos', 7.8, 'media', 'medio', CURRENT_TIMESTAMP + INTERVAL '30 days'),
('Entretenimiento', 'US', 'Curiosidades virales', 8.8, 'muy alta', 'medio', CURRENT_TIMESTAMP + INTERVAL '30 days');
