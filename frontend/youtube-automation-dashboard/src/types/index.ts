export interface Channel {
  id: string;
  youtube_channel_id: string;
  name: string;
  description?: string;
  niche?: string;
  language: string;
  region: string;
  status: 'active' | 'inactive' | 'error';
  subscriber_count?: number;
  video_count?: number;
  created_at: string;
}

export interface Campaign {
  id: string;
  channel_id: string;
  name: string;
  niche: string;
  language: string;
  schedule: {
    times: string[];
    days: string[];
  };
  videos_per_day: number;
  style: string;
  target_audience?: string;
  status: 'active' | 'paused' | 'completed';
  videos_generated: number;
  total_views: number;
  estimated_revenue: number;
  created_at: string;
}

export interface GeneratedVideo {
  id: string;
  campaign_id: string;
  script: string;
  metadata: {
    title: string;
    description: string;
    tags: string[];
    category: string;
  };
  youtube_video_id?: string;
  status: 'pending' | 'generating' | 'ready' | 'uploaded' | 'failed';
  views: number;
  watch_time_seconds: number;
  retention_rate: number;
  rpm: number;
  created_at: string;
  uploaded_at?: string;
}

export interface AnalyticsData {
  channel_id: string;
  date: string;
  views: number;
  watch_time_seconds: number;
  subscribers_gained: number;
  subscribers_lost: number;
  estimated_revenue: number;
  rpm: number;
  retention_rate: number;
  ctr: number;
}

export interface Trend {
  niche: string;
  region: string;
  topic: string;
  viral_score: number;
  competition_level: string;
  monetization_potential: string;
  discovered_at: string;
}

export interface NicheData {
  niche: string;
  estimated_rpm: number;
  estimated_cpm: number;
  entry_difficulty: string;
  growth_potential: string;
  target_audience: string;
  competition: string;
  recommendation: string;
}

export interface DashboardStats {
  totalChannels: number;
  totalCampaigns: number;
  totalVideos: number;
  totalViews: number;
  estimatedRevenue: number;
  avgRPM: number;
  activeCampaigns: number;
  scheduledVideos: number;
}
