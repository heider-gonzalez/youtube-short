import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  YouTube as YouTubeIcon,
  OpenInNew as OpenInNewIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';

interface YouTubeAuthProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess: (tokens: any) => void;
}

const YouTubeAuth: React.FC<YouTubeAuthProps> = ({ open, onClose, onAuthSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [authUrl, setAuthUrl] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokens, setTokens] = useState<any>(null);

  const steps = [
    'Configurar credenciales',
    'Autorizar aplicación',
    'Completar autenticación',
  ];

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setAuthCode('');
      setError('');
      setTokens(null);
    }
  }, [open]);

  const generateAuthUrl = () => {
    // En producción, esto generaría la URL real usando el backend
    const clientId = process.env.VITE_YOUTUBE_CLIENT_ID || 'your_client_id';
    const redirectUri = process.env.VITE_YOUTUBE_REDIRECT_URI || 'http://localhost:3000/oauth/callback';
    
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ].join(' ');

    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    setAuthUrl(url);
    setActiveStep(1);
  };

  const handleOpenAuthUrl = () => {
    if (authUrl) {
      window.open(authUrl, '_blank');
    }
  };

  const handleAuthenticate = async () => {
    if (!authCode) {
      setError('Por favor ingresa el código de autorización');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // En producción: llamar al backend para intercambiar el código por tokens
      // const response = await youtubeApi.auth(authCode);
      
      // Simular respuesta del backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTokens = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expiry_date: new Date(Date.now() + 3600 * 1000).toISOString(),
      };

      setTokens(mockTokens);
      setActiveStep(2);
    } catch (err) {
      setError('Error en la autenticación. Por favor verifica el código e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (tokens) {
      onAuthSuccess(tokens);
      onClose();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1a1a2e', color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <YouTubeIcon sx={{ color: '#ff0000', fontSize: 32 }} />
          Conectar Cuenta de YouTube
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#1a1a2e', color: '#fff', minHeight: 400 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ color: '#fff' }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 3 }}>
              Paso 1: Configurar Credenciales
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Antes de continuar, asegúrate de haber configurado las credenciales OAuth en Google Cloud Console
            </Alert>

            <Paper sx={{ bgcolor: '#16213e', p: 3, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#ff0000', mb: 2 }}>
                Instrucciones:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  1. Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ff0000' }}>Google Cloud Console</a>
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  2. Crea un proyecto y habilita YouTube Data API v3
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  3. Configura OAuth consent screen con los scopes necesarios
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  4. Crea credenciales OAuth 2.0 (Web application)
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  5. Configura el redirect URI: http://localhost:3000/oauth/callback
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  6. Copia el Client ID y Client Secret
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Client ID"
                placeholder="Pega tu Client ID de Google Console"
                sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                InputProps={{ 
                  sx: { color: '#fff', bgcolor: '#16213e' },
                  endAdornment: (
                    <Tooltip title="Este campo es solo informativo. Configura las credenciales en el archivo .env del backend.">
                      <IconButton sx={{ color: '#aaa' }}>
                        <ErrorIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Box>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                ⚠️ Las credenciales deben configurarse en el archivo <code>.env</code> del backend, no aquí.
                Este componente es solo para el proceso de autorización OAuth.
              </Typography>
            </Alert>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 3 }}>
              Paso 2: Autorizar Aplicación
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Haz clic en el botón para abrir la página de autorización de Google. Inicia sesión con tu cuenta de YouTube y autoriza la aplicación.
            </Alert>

            <Paper sx={{ bgcolor: '#16213e', p: 3, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#ff0000', mb: 2 }}>
                URL de Autorización:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  value={authUrl}
                  multiline
                  rows={3}
                  sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ 
                    sx: { color: '#fff', bgcolor: '#1a1a2e' },
                    readOnly: true
                  }}
                />
                <Tooltip title="Copiar URL">
                  <IconButton onClick={() => copyToClipboard(authUrl)} sx={{ color: '#fff' }}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>

            <Button
              fullWidth
              variant="contained"
              startIcon={<OpenInNewIcon />}
              onClick={handleOpenAuthUrl}
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' }, mb: 3 }}
            >
              Abrir Página de Autorización
            </Button>

            <Typography variant="subtitle1" sx={{ color: '#fff', mb: 2 }}>
              Código de Autorización:
            </Typography>
            <TextField
              fullWidth
              placeholder="Pega el código que recibiste después de autorizar"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
              InputProps={{ sx: { color: '#fff', bgcolor: '#16213e' } }}
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#00ff00', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
              ¡Autenticación Exitosa!
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              Tu cuenta de YouTube ha sido conectada exitosamente. El sistema ahora puede acceder a tus métricas y subir contenido.
            </Alert>
            <Paper sx={{ bgcolor: '#16213e', p: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>
                Permisos otorgados:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#00ff00' }}>
                  ✅ Subir videos a tu canal
                </Typography>
                <Typography variant="body2" sx={{ color: '#00ff00' }}>
                  ✅ Acceder a estadísticas del canal
                </Typography>
                <Typography variant="body2" sx={{ color: '#00ff00' }}>
                  ✅ Leer analytics de YouTube
                </Typography>
                <Typography variant="body2" sx={{ color: '#00ff00' }}>
                  ✅ Gestionar playlists y contenido
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ color: '#aaa', mt: 1, textAlign: 'center' }}>
              Procesando autenticación...
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#1a1a2e', p: 2 }}>
        {activeStep === 0 && (
          <>
            <Button onClick={onClose} sx={{ color: '#fff' }}>
              Cancelar
            </Button>
            <Button
              onClick={generateAuthUrl}
              variant="contained"
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
            >
              Continuar
            </Button>
          </>
        )}
        {activeStep === 1 && (
          <>
            <Button onClick={() => setActiveStep(0)} sx={{ color: '#fff' }}>
              Atrás
            </Button>
            <Button onClick={onClose} sx={{ color: '#fff' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleAuthenticate}
              variant="contained"
              disabled={!authCode || loading}
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
            >
              {loading ? 'Autenticando...' : 'Autenticar'}
            </Button>
          </>
        )}
        {activeStep === 2 && (
          <>
            <Button onClick={onClose} sx={{ color: '#fff' }}>
              Cerrar
            </Button>
            <Button
              onClick={handleComplete}
              variant="contained"
              sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
            >
              Completar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default YouTubeAuth;