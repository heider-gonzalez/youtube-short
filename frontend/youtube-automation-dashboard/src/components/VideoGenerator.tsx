import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Grid,
  Chip,
} from '@mui/material';
import {
  Movie as MovieCreationIcon,
  Star as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface VideoGeneratorProps {
  open: boolean;
  onClose: () => void;
  campaignId?: string;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ open, onClose, campaignId }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    niche: '',
    topic: '',
    style: 'viral',
    language: 'es',
    duration: 60,
    target_audience: '',
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

  const handleGenerate = async () => {
    try {
      setLoading(true);
      // En producción: await contentApi.generate(formData);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular generación
      
      setGeneratedContent({
        script: "¿Sabías que puedes triplicar tu productividad con este simple truco de 60 segundos? Primero, organiza tu espacio en tres zonas: trabajo, descanso y creatividad. Segundo, usa la técnica Pomodoro: 25 minutos de enfoque total, 5 de descanso. Tercero, elimina distracciones digitales. ¡Los resultados son increíbles! Suscríbete para más tips de productividad.",
        visual_prompts: [
          "Persona organizando escritorio con colores vibrantes",
          "Reloj mostrando técnica Pomodoro con animación",
          "Persona eliminando notificaciones del teléfono",
          "Persona trabajando enfocada con energía"
        ],
        metadata: {
          title: "TRUCO que TRIPlica tu PRODUCTIVIDAD 🚀",
          description: "Aprende este método simple en 60 segundos",
          tags: ["productividad", "tips", "organización", "trabajo"],
          category: "Education"
        }
      });
      
      setStep(2);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async () => {
    try {
      setLoading(true);
      // En producción: await contentApi.createVideo(generatedContent);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simular creación
      setStep(3);
    } catch (error) {
      console.error('Error creating video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setGeneratedContent(null);
    setFormData({
      niche: '',
      topic: '',
      style: 'viral',
      language: 'es',
      duration: 60,
      target_audience: '',
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1a1a2e', color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MovieCreationIcon sx={{ color: '#ff0000' }} />
          Generador de Videos con IA
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#1a1a2e', color: '#fff', minHeight: 400 }}>
        {step === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 3 }}>
              Paso 1: Configuración del Contenido
            </Typography>
            <Grid container spacing={2}>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tema (opcional, dejar vacío para tema automático)"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Ej: Tips de productividad"
                  sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#16213e' } }}
                />
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
                  label="Duración (segundos)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#16213e' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Audiencia objetivo (opcional)"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="Ej: 18-35 años, profesionales"
                  sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#16213e' } }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {step === 2 && generatedContent && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 3 }}>
              Paso 2: Revisar Contenido Generado
            </Typography>
            
            <Paper sx={{ bgcolor: '#16213e', p: 3, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#ff0000', mb: 2 }}>
                <AutoAwesomeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Script Generado
              </Typography>
              <Typography variant="body1" sx={{ color: '#fff', lineHeight: 1.6 }}>
                {generatedContent.script}
              </Typography>
            </Paper>

            <Paper sx={{ bgcolor: '#16213e', p: 3, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#ff0000', mb: 2 }}>
                Prompts Visuales ({generatedContent.visual_prompts.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {generatedContent.visual_prompts.map((prompt: string, index: number) => (
                  <Typography key={index} variant="body2" sx={{ color: '#fff' }}>
                    {index + 1}. {prompt}
                  </Typography>
                ))}
              </Box>
            </Paper>

            <Paper sx={{ bgcolor: '#16213e', p: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#ff0000', mb: 2 }}>
                Metadatos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Título: <span style={{ color: '#fff' }}>{generatedContent.metadata.title}</span>
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Descripción: <span style={{ color: '#fff' }}>{generatedContent.metadata.description}</span>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {generatedContent.metadata.tags.map((tag: string, index: number) => (
                    <Chip key={index} label={tag} size="small" sx={{ bgcolor: '#1a1a2e', color: '#fff' }} />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {step === 3 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#00ff00', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
              ¡Video Generado Exitosamente!
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              El video ha sido creado y está listo para subir
            </Alert>
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              El video se ha guardado en: /videos/short_1234567890.mp4
            </Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ color: '#aaa', mt: 1, textAlign: 'center' }}>
              {step === 1 ? 'Generando contenido con IA...' : 'Creando video...'}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#1a1a2e', p: 2 }}>
        {step === 1 && (
          <>
            <Button onClick={handleClose} sx={{ color: '#fff' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleGenerate}
              variant="contained"
              disabled={!formData.niche || loading}
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
            >
              {loading ? 'Generando...' : 'Generar Contenido'}
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button onClick={() => setStep(1)} sx={{ color: '#fff' }}>
              Atrás
            </Button>
            <Button onClick={handleClose} sx={{ color: '#fff' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateVideo}
              variant="contained"
              disabled={loading}
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
            >
              {loading ? 'Creando Video...' : 'Crear Video'}
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <Button onClick={handleReset} sx={{ color: '#fff' }}>
              Generar Otro
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
            >
              Finalizar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default VideoGenerator;