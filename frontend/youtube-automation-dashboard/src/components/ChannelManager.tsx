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
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  YouTube as YouTubeIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { Channel } from '../types';
import { youtubeApi } from '../services/api';
import YouTubeAuth from './YouTubeAuth';

const ChannelManager: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      setLoading(true);
      // Simular carga de datos - en producción usar API real
      const mockChannels: Channel[] = [
        {
          id: '1',
          youtube_channel_id: 'UC123456789',
          name: 'TechTips Daily',
          description: 'Tips de tecnología en 60 segundos',
          niche: 'Tecnología',
          language: 'es',
          region: 'ES',
          status: 'active',
          subscriber_count: 15000,
          video_count: 45,
          created_at: '2024-01-15',
        },
        {
          id: '2',
          youtube_channel_id: 'UC987654321',
          name: 'Finance Hacks',
          description: 'Consejos financieros rápidos',
          niche: 'Finanzas',
          language: 'en',
          region: 'US',
          status: 'active',
          subscriber_count: 28000,
          video_count: 78,
          created_at: '2024-02-01',
        },
      ];
      setChannels(mockChannels);
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectChannel = () => {
    setAuthDialogOpen(true);
  };

  const handleAuthSuccess = (tokens: any) => {
    console.log('Auth successful:', tokens);
    // Aquí guardaríamos los tokens en el backend
    loadChannels();
  };

  const handleDeleteChannel = async (channelId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este canal?')) {
      try {
        // En producción: await youtubeApi.deleteChannel(channelId);
        setChannels(channels.filter(c => c.id !== channelId));
      } catch (error) {
        console.error('Error deleting channel:', error);
      }
    }
  };

  const getStatusIcon = (status: Channel['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon sx={{ color: '#00ff00' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#ff0000' }} />;
      default:
        return <PauseIcon sx={{ color: '#ffff00' }} />;
    }
  };

  const getStatusColor = (status: Channel['status']) => {
    switch (status) {
      case 'active':
        return '#00ff00';
      case 'error':
        return '#ff0000';
      default:
        return '#ffff00';
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
          Gestión de Canales
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadChannels}
            sx={{ color: '#fff', borderColor: '#ff0000' }}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleConnectChannel}
            sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
          >
            Conectar Canal
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {channels.map((channel) => (
          <Grid item xs={12} md={6} lg={4} key={channel.id}>
            <Card sx={{ bgcolor: '#16213e', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <YouTubeIcon sx={{ color: '#ff0000', fontSize: 40 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        {channel.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        {getStatusIcon(channel.status)}
                        <Chip
                          label={channel.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(channel.status),
                            color: '#000',
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Tooltip title="Eliminar canal">
                    <IconButton onClick={() => handleDeleteChannel(channel.id)} sx={{ color: '#ff0000' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
                    {channel.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    <Chip label={channel.niche} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                    <Chip label={channel.language} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                    <Chip label={channel.region} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                  </Box>
                </Box>

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #333' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        Suscriptores
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        {channel.subscriber_count?.toLocaleString() || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        Videos
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        {channel.video_count || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {channels.length === 0 && (
        <Paper sx={{ bgcolor: '#16213e', p: 4, textAlign: 'center' }}>
          <YouTubeIcon sx={{ fontSize: 64, color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            No hay canales conectados
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 3 }}>
            Conecta tu primer canal de YouTube para comenzar a generar contenido automatizado
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleConnectChannel}
            sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
          >
            Conectar Primer Canal
          </Button>
        </Paper>
      )}

      <YouTubeAuth 
        open={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </Box>
  );
};

export default ChannelManager;
