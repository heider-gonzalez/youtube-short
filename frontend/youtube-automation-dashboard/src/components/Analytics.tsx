import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Tab,
  Tabs,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Money as MoneyIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsData } from '../types';
import { analyticsApi } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Analytics: React.FC = () => {
  const [value, setValue] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);

  const channels = [
    { id: '1', name: 'TechTips Daily' },
    { id: '2', name: 'Finance Hacks' },
  ];

  // Datos simulados para gráficos
  const performanceData = [
    { name: 'Lun', views: 4000, revenue: 45, retention: 65 },
    { name: 'Mar', views: 3000, revenue: 35, retention: 62 },
    { name: 'Mié', views: 5000, revenue: 55, retention: 68 },
    { name: 'Jue', views: 4500, revenue: 50, retention: 66 },
    { name: 'Vie', views: 6000, revenue: 65, retention: 70 },
    { name: 'Sáb', views: 7000, revenue: 75, retention: 72 },
    { name: 'Dom', views: 5500, revenue: 60, retention: 67 },
  ];

  const audienceData = [
    { name: '18-24', value: 25 },
    { name: '25-34', value: 40 },
    { name: '35-44', value: 20 },
    { name: '45-54', value: 10 },
    { name: '55+', value: 5 },
  ];

  const revenueData = [
    { name: 'Lun', value: 45 },
    { name: 'Mar', value: 35 },
    { name: 'Mié', value: 55 },
    { name: 'Jue', value: 50 },
    { name: 'Vie', value: 65 },
    { name: 'Sáb', value: 75 },
    { name: 'Dom', value: 60 },
  ];

  const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

  const handleLoadAnalytics = async () => {
    try {
      setLoading(true);
      // En producción: const data = await analyticsApi.analyze({ channel_id: selectedChannel, time_range: timeRange });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular carga
      setAnalyticsData(performanceData as any);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; subtitle?: string; color?: string }> = ({
    icon,
    title,
    value,
    subtitle,
    color = '#ff0000',
  }) => (
    <Card sx={{ bgcolor: '#16213e', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color, mr: 2 }}>{icon}</Box>
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 3 }}>
        Analytics y Rendimiento
      </Typography>

      <Paper sx={{ bgcolor: '#16213e', p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#aaa' }}>Canal</InputLabel>
              <Select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                sx={{ color: '#fff', bgcolor: '#1a1a2e' }}
              >
                {channels.map((channel) => (
                  <MenuItem key={channel.id} value={channel.id} sx={{ color: '#fff' }}>
                    {channel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#aaa' }}>Período</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{ color: '#fff', bgcolor: '#1a1a2e' }}
              >
                <MenuItem value="7d" sx={{ color: '#fff' }}>Últimos 7 días</MenuItem>
                <MenuItem value="30d" sx={{ color: '#fff' }}>Últimos 30 días</MenuItem>
                <MenuItem value="90d" sx={{ color: '#fff' }}>Últimos 90 días</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleLoadAnalytics}
              disabled={!selectedChannel || loading}
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
            >
              {loading ? 'Cargando...' : 'Analizar'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={(e, newValue) => setValue(newValue)} sx={{ color: '#fff' }}>
          <Tab label="General" />
          <Tab label="Rendimiento" />
          <Tab label="Audiencia" />
          <Tab label="Monetización" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<VisibilityIcon />}
              title="Vistas Totales"
              value={35000}
              subtitle="+15.3% vs período anterior"
              color="#00ff00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ScheduleIcon />}
              title="Tiempo de Visualización"
              value="2,500h"
              subtitle="+12.5% vs período anterior"
              color="#ffff00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<PeopleIcon />}
              title="Suscriptores"
              value="+1,200"
              subtitle="-150 cancelaciones"
              color="#00ffff"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<MoneyIcon />}
              title="Ingresos Estimados"
              value="$425"
              subtitle="RPM: $12.50"
              color="#ff0000"
            />
          </Grid>

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
                  <Line type="monotone" dataKey="views" stroke="#ff0000" strokeWidth={2} name="Vistas" />
                  <Line type="monotone" dataKey="retention" stroke="#00ff00" strokeWidth={2} name="Retención %" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Resumen de Métricas
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>CTR Promedio</Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>4.2%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Retención Promedio</Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>65.5%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Duración Promedio</Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>58s</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Engagement</Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>8.5%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Análisis de Rendimiento por Video
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                  />
                  <Bar dataKey="views" fill="#ff0000" name="Vistas" />
                  <Bar dataKey="retention" fill="#00ff00" name="Retención %" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Distribución por Edad
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Datos Demográficos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Género</Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>55% Hombres, 45% Mujeres</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Ubicación Principal</Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>Estados Unidos (35%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Dispositivos</Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>Móvil (78%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Horario Pico</Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>18:00 - 21:00</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Ingresos por Día
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                  />
                  <Bar dataKey="value" fill="#ffff00" name="Ingresos ($)" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Métricas de Monetización
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>RPM Actual</Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>$12.50</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>CPM</Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>$18.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Fill Rate</Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>85%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>Ingresos Totales (Mes)</Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>$1,562.50</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Recomendaciones de Monetización
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#00ff00' }}>✅ Aumentar duración a 58-59s</Typography>
                <Typography variant="body2" sx={{ color: '#00ff00' }}>✅ Optimizar para audiencia EE.UU.</Typography>
                <Typography variant="body2" sx={{ color: '#00ff00' }}>✅ Incluir keywords de alto CPC</Typography>
                <Typography variant="body2" sx={{ color: '#ffff00' }}>⚠️ Considerar contenido educativo</Typography>
                <Typography variant="body2" sx={{ color: '#ffff00' }}>⚠️ Expandir a nichos complementarios</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Analytics;
