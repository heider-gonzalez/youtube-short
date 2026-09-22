import axios from 'axios';

const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';
const NODE_API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3001';

// Python API (IA y Análisis)
const pythonApi = axios.create({
  baseURL: PYTHON_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Node.js API (Automatización y YouTube)
const nodeApi = axios.create({
  baseURL: NODE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para manejo de errores
pythonApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Python API Error:', error);
    return Promise.reject(error);
  }
);

nodeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Node API Error:', error);
    return Promise.reject(error);
  }
);

// Content Generation API
export const contentApi = {
  generate: (data: any) => pythonApi.post('/api/content/generate', data),
  createVideo: (data: any) => pythonApi.post('/api/content/create-video', data),
  getTrendingTopics: (niche: string, language: string) =>
    pythonApi.get(`/api/content/trending-topics/${niche}?language=${language}`),
};

// Analytics API
export const analyticsApi = {
  analyze: (data: any) => pythonApi.post('/api/analytics/analyze', data),
  getRecommendations: (channelId: string) =>
    pythonApi.get(`/api/analytics/recommendations/${channelId}`),
  analyzeRPM: (channelId: string) =>
    pythonApi.get(`/api/analytics/rpm-analysis/${channelId}`),
  analyzeRetention: (videoId: string) =>
    pythonApi.get(`/api/analytics/retention-analysis/${videoId}`),
};

// Trends API
export const trendsApi = {
  analyze: (data: any) => pythonApi.post('/api/trends/analyze', data),
  getViralTopics: (region: string, category?: string) =>
    pythonApi.get(`/api/trends/viral-topics?region=${region}${category ? `&category=${category}` : ''}`),
  getHighRPMNiches: () => pythonApi.get('/api/trends/high-rpm-niches'),
  getGrowthOpportunities: () => pythonApi.get('/api/trends/growth-opportunities'),
};

// Gemini API
export const geminiApi = {
  generate: (data: any) => pythonApi.post('/api/gemini/generate', data),
  analyzeChannel: (data: any) => pythonApi.post('/api/gemini/analyze-channel', data),
  optimizeContent: (data: any) => pythonApi.post('/api/gemini/optimize-content', data),
  spamCheck: (content: string) => pythonApi.get(`/api/gemini/spam-check?content=${encodeURIComponent(content)}`),
  generateThumbnails: (data: any) => pythonApi.post('/api/gemini/generate-thumbnails', data),
};

// YouTube API
export const youtubeApi = {
  auth: (code: string) => nodeApi.post('/api/youtube/auth', { code }),
  getChannel: (channelId: string) => nodeApi.get(`/api/youtube/channel/${channelId}`),
  upload: (data: any) => nodeApi.post('/api/youtube/upload', data),
  getStats: (channelId: string) => nodeApi.get(`/api/youtube/stats/${channelId}`),
  getAnalytics: (channelId: string, startDate?: string, endDate?: string) =>
    nodeApi.get(`/api/youtube/analytics/${channelId}?startDate=${startDate || ''}&endDate=${endDate || ''}`),
  getVideos: (channelId: string, maxResults?: number) =>
    nodeApi.get(`/api/youtube/videos/${channelId}?maxResults=${maxResults || 50}`),
  getTrending: (regionCode?: string, categoryId?: string) =>
    nodeApi.get(`/api/youtube/trending?regionCode=${regionCode || 'US'}${categoryId ? `&categoryId=${categoryId}` : ''}`),
  search: (query: string, maxResults?: number) =>
    nodeApi.get(`/api/youtube/search?query=${encodeURIComponent(query)}&maxResults=${maxResults || 25}`),
};

// Automation API
export const automationApi = {
  createCampaign: (data: any) => nodeApi.post('/api/automation/campaign', data),
  getCampaigns: () => nodeApi.get('/api/automation/campaigns'),
  getCampaign: (id: string) => nodeApi.get(`/api/automation/campaign/${id}`),
  updateCampaign: (id: string, data: any) => nodeApi.put(`/api/automation/campaign/${id}`, data),
  toggleCampaign: (id: string) => nodeApi.post(`/api/automation/campaign/${id}/toggle`),
  deleteCampaign: (id: string) => nodeApi.delete(`/api/automation/campaign/${id}`),
  generateVideo: (id: string) => nodeApi.post(`/api/automation/campaign/${id}/generate`),
  getStats: () => nodeApi.get('/api/automation/stats'),
  updateSchedule: (data: any) => nodeApi.post('/api/automation/schedule', data),
  getSchedule: () => nodeApi.get('/api/automation/schedule'),
};

// Queue API
export const queueApi = {
  addJob: (data: any) => nodeApi.post('/api/queue/add', data),
  getStatus: () => nodeApi.get('/api/queue/status'),
  getJob: (jobId: string) => nodeApi.get(`/api/queue/job/${jobId}`),
  cancelJob: (jobId: string) => nodeApi.delete(`/api/queue/job/${jobId}`),
  processQueue: () => nodeApi.post('/api/queue/process'),
  cleanQueue: () => nodeApi.post('/api/queue/clean'),
};

export default {
  content: contentApi,
  analytics: analyticsApi,
  trends: trendsApi,
  gemini: geminiApi,
  youtube: youtubeApi,
  automation: automationApi,
  queue: queueApi,
};
