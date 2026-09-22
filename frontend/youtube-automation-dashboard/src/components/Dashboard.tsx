import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  YouTube as YouTubeIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  VideoLibrary as VideoLibraryIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Movie as MovieCreationIcon,
  Flag as CampaignIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VideoGenerator from './VideoGenerator';

interface DashboardStats {
  totalChannels: number;
  totalCampaigns: number;
  totalVideos: number;
  totalViews: number;
  estimatedRevenue: number;
  avgRPM: number;
  activeCampaigns: number;
  scheduledVideos: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalChannels: 0,
    totalCampaigns: 0,
    totalVideos: 0,
    totalViews: 0,
    estimatedRevenue: 0,
    avgRPM: 0,
    activeCampaigns: 0,
    scheduledVideos: 0,
  });

  const [loading, setLoading] = useState(true);
  const [videoGeneratorOpen, setVideoGeneratorOpen] = useState(false);

  // Datos simulados para el gráfico
  const performanceData = [
    { name: 'Lun', views: 4000, revenue: 45 },
    { name: 'Mar', views: 3000, revenue: 35 },
    { name: 'Mié', views: 5000, revenue: 55 },
    { name: 'Jue', views: 4500, revenue: 50 },
    { name: 'Vie', views: 6000, revenue: 65 },
    { name: 'Sáb', views: 7000, revenue: 75 },
    { name: 'Dom', views: 5500, revenue: 60 },
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        totalChannels: 5,
        totalCampaigns: 12,
        totalVideos: 156,
        totalViews: 1250000,
        estimatedRevenue: 15625,
        avgRPM: 12.50,
        activeCampaigns: 8,
        scheduledVideos: 24,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; subtitle?: string }> = ({
    icon,
    title,
    value,
    subtitle,
  }) => (
    <Card sx={{ bgcolor: '#16213e', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color: '#ff0000', mr: 2 }}>{icon}</Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ color: '#fff', mb: 1 }}>
          {typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 3 }}>
        Dashboard General
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<YouTubeIcon />}
            title="Canales Activos"
            value={stats.totalChannels}
            subtitle={`${stats.activeCampaigns} campañas activas`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<VideoLibraryIcon />}
            title="Videos Generados"
            value={stats.totalVideos}
            subtitle={`${stats.scheduledVideos} programados`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon />}
            title="Vistas Totales"
            value={stats.totalViews}
            subtitle="+15.3% este mes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<MoneyIcon />}
            title="Ingresos Estimados"
            value={`$${stats.estimatedRevenue.toLocaleString()}`}
            subtitle={`RPM: $${stats.avgRPM.toFixed(2)}`}
          />
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
              Rendimiento Semanal
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                />
                <Line type="monotone" dataKey="views" stroke="#ff0000" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#00ff00" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
              Acciones Rápidas
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PeopleIcon />}
                sx={{ color: '#fff', borderColor: '#ff0000', justifyContent: 'flex-start' }}
              >
                Conectar nuevo canal
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CampaignIcon />}
                sx={{ color: '#fff', borderColor: '#ff0000', justifyContent: 'flex-start' }}
              >
                Crear nueva campaña
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<MovieCreationIcon />}
                onClick={() => setVideoGeneratorOpen(true)}
                sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' }, justifyContent: 'flex-start' }}
              >
                Generar video ahora
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TrendingUpIcon />}
                sx={{ color: '#fff', borderColor: '#ff0000', justifyContent: 'flex-start' }}
              >
                Analizar tendencias
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* High RPM Niches */}
        <Grid item xs={12}>
          <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
              Nichos con Alto RPM 🎯
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'Finanzas', rpm: 18.50, growth: '+25%' },
                { name: 'Tecnología', rpm: 15.20, growth: '+18%' },
                { name: 'Marketing', rpm: 14.80, growth: '+22%' },
                { name: 'Educación', rpm: 11.50, growth: '+15%' },
              ].map((niche) => (
                <Grid item xs={12} sm={6} md={3} key={niche.name}>
                  <Box
                    sx={{
                      bgcolor: '#1a1a2e',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid #333',
                    }}
                  >
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {niche.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ff0000', mt: 1 }}>
                      RPM: ${niche.rpm.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00ff00' }}>
                      Crecimiento: {niche.growth}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <VideoGenerator 
        open={videoGeneratorOpen} 
        onClose={() => setVideoGeneratorOpen(false)} 
      />
    </Box>
  );
};

export default Dashboard;
