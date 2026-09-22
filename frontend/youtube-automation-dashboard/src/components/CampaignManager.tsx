import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  LinearProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  TrendingUp as TrendingUpIcon,
  Money as MoneyIcon,
  VideoLibrary as VideoLibraryIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { Campaign } from '../types';
import { automationApi } from '../services/api';

const CampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    channel_id: '',
    niche: '',
    language: 'es',
    videos_per_day: 1,
    style: 'viral',
    target_audience: '',
    schedule: {
      times: ['09:00'],
      days: ['mon', 'wed', 'fri']
    }
  });

  const niches = [
    'Tecnología', 'Finanzas', 'Marketing', 'Educación', 
    'Salud', 'Entretenimiento', 'Gaming', 'Lifestyle'
  ];

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'Inglés' },
    { code: 'pt', name: 'Portugués' },
    { code: 'de', name: 'Alemán' },
    { code: 'fr', name: 'Francés' }
  ];

  const styles = ['viral', 'educational', 'entertaining', 'informative'];

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      // Simular carga de datos
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          channel_id: '1',
          name: 'Tech Tips Virales',
          niche: 'Tecnología',
          language: 'es',
          schedule: { times: ['09:00', '15:00', '21:00'], days: ['mon', 'wed', 'fri'] },
          videos_per_day: 3,
          style: 'viral',
          target_audience: '18-35 años, entusiastas tech',
          status: 'active',
          videos_generated: 45,
          total_views: 125000,
          estimated_revenue: 1562,
          created_at: '2024-01-15',
        },
        {
          id: '2',
          channel_id: '2',
          name: 'Finance Daily',
          niche: 'Finanzas',
          language: 'en',
          schedule: { times: ['12:00', '18:00'], days: ['tue', 'thu', 'sat'] },
          videos_per_day: 2,
          style: 'educational',
          target_audience: '25-45 años, interesados en finanzas',
          status: 'active',
          videos_generated: 32,
          total_views: 89000,
          estimated_revenue: 2225,
          created_at: '2024-02-01',
        },
        {
          id: '3',
          channel_id: '1',
          name: 'Lifestyle Hacks',
          niche: 'Lifestyle',
          language: 'es',
          schedule: { times: ['10:00'], days: ['sun'] },
          videos_per_day: 1,
          style: 'entertaining',
          target_audience: 'General',
          status: 'paused',
          videos_generated: 15,
          total_views: 35000,
          estimated_revenue: 280,
          created_at: '2024-03-01',
        },
      ];
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      channel_id: '',
      niche: '',
      language: 'es',
      videos_per_day: 1,
      style: 'viral',
      target_audience: '',
      schedule: { times: ['09:00'], days: ['mon', 'wed', 'fri'] }
    });
    setOpenDialog(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      channel_id: campaign.channel_id,
      niche: campaign.niche,
      language: campaign.language,
      videos_per_day: campaign.videos_per_day,
      style: campaign.style,
      target_audience: campaign.target_audience || '',
      schedule: campaign.schedule
    });
    setOpenDialog(true);
  };

  const handleSaveCampaign = async () => {
    try {
      if (editingCampaign) {
        // En producción: await automationApi.updateCampaign(editingCampaign.id, formData);
        setCampaigns(campaigns.map(c => 
          c.id === editingCampaign.id 
            ? { ...c, ...formData }
            : c
        ));
      } else {
        // En producción: await automationApi.createCampaign(formData);
        const newCampaign: Campaign = {
          id: Date.now().toString(),
          ...formData,
          status: 'active',
          videos_generated: 0,
          total_views: 0,
          estimated_revenue: 0,
          created_at: new Date().toISOString(),
        };
        setCampaigns([...campaigns, newCampaign]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleToggleCampaign = async (campaignId: string) => {
    try {
      // En producción: await automationApi.toggleCampaign(campaignId);
      setCampaigns(campaigns.map(c => 
        c.id === campaignId 
          ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
          : c
      ));
    } catch (error) {
      console.error('Error toggling campaign:', error);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta campaña?')) {
      try {
        // En producción: await automationApi.deleteCampaign(campaignId);
        setCampaigns(campaigns.filter(c => c.id !== campaignId));
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleGenerateVideo = async (campaignId: string) => {
    try {
      // En producción: await automationApi.generateVideo(campaignId);
      alert('Video generado exitosamente');
    } catch (error) {
      console.error('Error generating video:', error);
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return '#00ff00';
      case 'paused':
        return '#ffff00';
      case 'completed':
        return '#00ffff';
      default:
        return '#ff0000';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>
          Gestión de Campañas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCampaign}
          sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
        >
          Crear Campaña
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} lg={4} key={campaign.id}>
            <Card sx={{ bgcolor: '#16213e', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                      {campaign.name}
                    </Typography>
                    <Chip
                      label={campaign.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(campaign.status),
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={campaign.status === 'active' ? 'Pausar' : 'Activar'}>
                      <IconButton 
                        onClick={() => handleToggleCampaign(campaign.id)}
                        sx={{ color: '#fff' }}
                      >
                        {campaign.status === 'active' ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        onClick={() => handleEditCampaign(campaign)}
                        sx={{ color: '#fff' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        sx={{ color: '#ff0000' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip label={campaign.niche} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                  <Chip label={campaign.language} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                  <Chip label={campaign.style} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #333' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VideoLibraryIcon sx={{ color: '#ff0000', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#aaa' }}>
                            Videos
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#fff' }}>
                            {campaign.videos_generated}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon sx={{ color: '#00ff00', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#aaa' }}>
                            Vistas
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#fff' }}>
                            {campaign.total_views.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon sx={{ color: '#ffff00', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: '#aaa' }}>
                            Ingresos
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#fff' }}>
                            ${campaign.estimated_revenue.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>
                          Videos/día
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff' }}>
                          {campaign.videos_per_day}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleGenerateVideo(campaign.id)}
                  disabled={campaign.status !== 'active'}
                  sx={{ 
                    mt: 2, 
                    color: '#fff', 
                    borderColor: '#ff0000',
                    '&:hover': { borderColor: '#cc0000', bgcolor: 'rgba(255, 0, 0, 0.1)' }
                  }}
                >
                  Generar Video Ahora
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {campaigns.length === 0 && (
        <Paper sx={{ bgcolor: '#16213e', p: 4, textAlign: 'center' }}>
          <CampaignIcon sx={{ fontSize: 64, color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            No hay campañas activas
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 3 }}>
            Crea tu primera campaña para comenzar a generar contenido automatizado
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCampaign}
            sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
          >
            Crear Primera Campaña
          </Button>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1a1a2e', color: '#fff' }}>
          {editingCampaign ? 'Editar Campaña' : 'Crear Nueva Campaña'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1a1a2e', color: '#fff' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la campaña"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                InputProps={{ sx: { color: '#fff', bgcolor: '#16213e' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#aaa' }}>Nicho</InputLabel>
                <Select
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  sx={{ color: '#fff', bgcolor: '#16213e' }}
                >
                  {niches.map((niche) => (
                    <MenuItem key={niche} value={niche} sx={{ color: '#fff' }}>
                      {niche}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#aaa' }}>Idioma</InputLabel>
                <Select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  sx={{ color: '#fff', bgcolor: '#16213e' }}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code} sx={{ color: '#fff' }}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#aaa' }}>Estilo</InputLabel>
                <Select
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  sx={{ color: '#fff', bgcolor: '#16213e' }}
                >
                  {styles.map((style) => (
                    <MenuItem key={style} value={style} sx={{ color: '#fff' }}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Videos por día"
                type="number"
                value={formData.videos_per_day}
                onChange={(e) => setFormData({ ...formData, videos_per_day: parseInt(e.target.value) })}
                sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                InputProps={{ sx: { color: '#fff', bgcolor: '#16213e' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Audiencia objetivo"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                placeholder="Ej: 18-35 años, interesados en tecnología"
                sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                InputProps={{ sx: { color: '#fff', bgcolor: '#16213e' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1a1a2e', p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#fff' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveCampaign}
            variant="contained"
            disabled={!formData.name || !formData.niche}
            sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
          >
            {editingCampaign ? 'Guardar Cambios' : 'Crear Campaña'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampaignManager;
