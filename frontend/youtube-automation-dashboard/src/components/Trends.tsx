import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  LocalFireDepartment as FireIcon,
  Money as MoneyIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { Trend, NicheData } from '../types';
import { trendsApi } from '../services/api';

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

const Trends: React.FC = () => {
  const [value, setValue] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [viralTopics, setViralTopics] = useState<Trend[]>([]);
  const [highRPMNiches, setHighRPMNiches] = useState<NicheData[]>([]);
  const [growthOpportunities, setGrowthOpportunities] = useState<any[]>([]);

  const regions = [
    { code: 'US', name: 'Estados Unidos' },
    { code: 'ES', name: 'España' },
    { code: 'MX', name: 'México' },
    { code: 'BR', name: 'Brasil' },
    { code: 'AR', name: 'Argentina' },
    { code: 'DE', name: 'Alemania' },
    { code: 'FR', name: 'Francia' },
  ];

  const niches = [
    'Tecnología', 'Finanzas', 'Marketing', 'Educación', 
    'Salud', 'Entretenimiento', 'Gaming', 'Lifestyle'
  ];

  useEffect(() => {
    loadTrendsData();
  }, [selectedRegion]);

  const loadTrendsData = async () => {
    try {
      setLoading(true);
      // En producción: usar APIs reales
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular carga
      
      // Datos simulados
      const mockViralTopics: Trend[] = [
        {
          niche: 'Tecnología',
          region: selectedRegion,
          topic: 'Nuevos gadgets 2024',
          viral_score: 9.2,
          competition_level: 'alta',
          monetization_potential: 'alto',
          discovered_at: new Date().toISOString(),
        },
        {
          niche: 'Finanzas',
          region: selectedRegion,
          topic: 'Inversiones para principiantes',
          viral_score: 8.8,
          competition_level: 'media',
          monetization_potential: 'alto',
          discovered_at: new Date().toISOString(),
        },
        {
          niche: 'Lifestyle',
          region: selectedRegion,
          topic: 'Hacks de productividad',
          viral_score: 8.5,
          competition_level: 'alta',
          monetization_potential: 'medio',
          discovered_at: new Date().toISOString(),
        },
        {
          niche: 'Educación',
          region: selectedRegion,
          topic: 'Aprende en 60 segundos',
          viral_score: 8.3,
          competition_level: 'media',
          monetization_potential: 'medio',
          discovered_at: new Date().toISOString(),
        },
      ];

      const mockHighRPMNiches: NicheData[] = [
        {
          niche: 'Finanzas Personales',
          estimated_rpm: 18.50,
          estimated_cpm: 25.00,
          entry_difficulty: 'alta',
          growth_potential: 'alto',
          target_audience: '25-45 años, ingresos medios-altos',
          competition: 'alta',
          recommendation: 'alta',
        },
        {
          niche: 'Tecnología y Gadgets',
          estimated_rpm: 15.20,
          estimated_cpm: 20.00,
          entry_difficulty: 'media',
          growth_potential: 'alto',
          target_audience: '18-40 años, entusiastas tech',
          competition: 'alta',
          recommendation: 'alta',
        },
        {
          niche: 'Marketing Digital',
          estimated_rpm: 14.80,
          estimated_cpm: 19.50,
          entry_difficulty: 'media',
          growth_potential: 'alto',
          target_audience: '20-45 años, emprendedores',
          competition: 'media',
          recommendation: 'alta',
        },
        {
          niche: 'Educación Profesional',
          estimated_rpm: 11.50,
          estimated_cpm: 15.00,
          entry_difficulty: 'baja',
          growth_potential: 'alto',
          target_audience: '18-45 años, estudiantes y profesionales',
          competition: 'media',
          recommendation: 'alta',
        },
        {
          niche: 'Salud y Fitness',
          estimated_rpm: 12.30,
          estimated_cpm: 16.00,
          entry_difficulty: 'media',
          growth_potential: 'medio',
          target_audience: '18-50 años, interesados en salud',
          competition: 'alta',
          recommendation: 'media',
        },
      ];

      const mockGrowthOpportunities = [
        {
          type: 'Expansión Geográfica',
          description: 'Crear contenido para mercados de alto RPM (EE.UU., Canadá, Australia)',
          impact_potential: 'muy alto',
          implementation_difficulty: 'media',
          estimated_time: '3-6 meses',
          required_resources: ['Traducción', 'Adaptación cultural', 'SEO local'],
        },
        {
          type: 'Multi-Nicho',
          description: 'Diversificar contenido en 2-3 nichos complementarios',
          impact_potential: 'alto',
          implementation_difficulty: 'media',
          estimated_time: '2-4 meses',
          required_resources: ['Investigación de nichos', 'Creación de contenido', 'Análisis'],
        },
        {
          type: 'Optimización de Horarios',
          description: 'Publicar en horarios óptimos según audiencia objetivo',
          impact_potential: 'medio',
          implementation_difficulty: 'baja',
          estimated_time: '2-4 semanas',
          required_resources: ['Análisis de datos', 'Programación'],
        },
      ];

      setViralTopics(mockViralTopics);
      setHighRPMNiches(mockHighRPMNiches);
      setGrowthOpportunities(mockGrowthOpportunities);
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 9) return '#00ff00';
    if (score >= 8) return '#ffff00';
    return '#ff0000';
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'alta': return '#00ff00';
      case 'media': return '#ffff00';
      default: return '#ff0000';
    }
  };

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
        Análisis de Tendencias
      </Typography>

      <Paper sx={{ bgcolor: '#16213e', p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#aaa' }}>Región</InputLabel>
              <Select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                sx={{ color: '#fff', bgcolor: '#1a1a2e' }}
              >
                {regions.map((region) => (
                  <MenuItem key={region.code} value={region.code} sx={{ color: '#fff' }}>
                    {region.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={loadTrendsData}
              startIcon={<TrendingUpIcon />}
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
            >
              Actualizar Tendencias
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={(e, newValue) => setValue(newValue)} sx={{ color: '#fff' }}>
          <Tab label="Temas Virales" />
          <Tab label="Nichos Alto RPM" />
          <Tab label="Oportunidades" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Grid container spacing={3}>
          {viralTopics.map((topic, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ bgcolor: '#16213e', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <FireIcon sx={{ color: '#ff0000', fontSize: 32 }} />
                    <Chip
                      label={`Score: ${topic.viral_score}`}
                      size="small"
                      sx={{
                        bgcolor: getViralScoreColor(topic.viral_score),
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                    {topic.topic}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label={topic.niche} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                    <Chip label={topic.region} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>Competencia</Typography>
                      <Typography variant="body2" sx={{ color: '#fff' }}>{topic.competition_level}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>Potencial</Typography>
                      <Typography variant="body2" sx={{ color: '#00ff00' }}>{topic.monetization_potential}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid container spacing={3}>
          {highRPMNiches.map((niche, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ bgcolor: '#16213e' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <MoneyIcon sx={{ color: '#ffff00', fontSize: 32 }} />
                    <Chip
                      label={niche.recommendation}
                      size="small"
                      sx={{
                        bgcolor: getRecommendationColor(niche.recommendation),
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                    {niche.niche}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>RPM Estimado</Typography>
                      <Typography variant="h5" sx={{ color: '#00ff00' }}>${niche.estimated_rpm.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>CPM Estimado</Typography>
                      <Typography variant="h5" sx={{ color: '#00ff00' }}>${niche.estimated_cpm.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>Dificultad</Typography>
                      <Typography variant="body1" sx={{ color: '#fff' }}>{niche.entry_difficulty}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>Potencial</Typography>
                      <Typography variant="body1" sx={{ color: '#fff' }}>{niche.growth_potential}</Typography>
                    </Grid>
                  </Grid>
                  <Typography variant="body2" sx={{ color: '#aaa', mt: 2 }}>
                    Audiencia: {niche.target_audience}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Grid container spacing={3}>
          {growthOpportunities.map((opportunity, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ bgcolor: '#16213e' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <LightbulbIcon sx={{ color: '#ffff00', fontSize: 32 }} />
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                      {opportunity.type}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                    {opportunity.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>Impacto</Typography>
                      <Typography variant="body1" sx={{ color: '#00ff00' }}>{opportunity.impact_potential}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>Dificultad</Typography>
                      <Typography variant="body1" sx={{ color: '#fff' }}>{opportunity.implementation_difficulty}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>Tiempo Estimado</Typography>
                      <Typography variant="body1" sx={{ color: '#fff' }}>{opportunity.estimated_time}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>Recursos</Typography>
                      <Typography variant="body1" sx={{ color: '#fff' }}>{opportunity.required_resources.length} necesarios</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>Recursos necesarios:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {opportunity.required_resources.map((resource: string, i: number) => (
                        <Chip key={i} label={resource} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Trends;
