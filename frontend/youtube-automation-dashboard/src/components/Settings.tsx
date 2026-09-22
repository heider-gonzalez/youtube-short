import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tab,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  API as APIIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

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

const Settings: React.FC = () => {
  const [value, setValue] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [apiSettings, setApiSettings] = useState({
    youtube_api_key: '',
    youtube_client_id: '',
    youtube_client_secret: '',
    gemini_api_key: '',
    openai_api_key: '',
    elevenlabs_api_key: '',
  });

  const [scheduleSettings, setScheduleSettings] = useState({
    default_upload_times: ['09:00', '15:00', '21:00'],
    max_videos_per_day: 10,
    auto_publish: true,
    optimal_time_detection: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    spam_detection_enabled: true,
    content_quality_check: true,
    copyright_check: true,
    max_daily_uploads_per_channel: 5,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    upload_complete: true,
    error_alerts: true,
    weekly_reports: true,
    email_address: '',
  });

  const handleSaveSettings = async () => {
    try {
      // En producción: guardar configuración en backend
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', mb: 3 }}>
        Configuración del Sistema
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuración guardada exitosamente
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={(e, newValue) => setValue(newValue)} sx={{ color: '#fff' }}>
          <Tab label="APIs" icon={<APIIcon />} />
          <Tab label="Programación" icon={<ScheduleIcon />} />
          <Tab label="Seguridad" icon={<SecurityIcon />} />
          <Tab label="Notificaciones" icon={<NotificationsIcon />} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#16213e' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  YouTube API
                </Typography>
                <TextField
                  fullWidth
                  label="API Key"
                  type="password"
                  value={apiSettings.youtube_api_key}
                  onChange={(e) => setApiSettings({ ...apiSettings, youtube_api_key: e.target.value })}
                  sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
                <TextField
                  fullWidth
                  label="Client ID"
                  type="password"
                  value={apiSettings.youtube_client_id}
                  onChange={(e) => setApiSettings({ ...apiSettings, youtube_client_id: e.target.value })}
                  sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
                <TextField
                  fullWidth
                  label="Client Secret"
                  type="password"
                  value={apiSettings.youtube_client_secret}
                  onChange={(e) => setApiSettings({ ...apiSettings, youtube_client_secret: e.target.value })}
                  sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#16213e' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  APIs de IA
                </Typography>
                <TextField
                  fullWidth
                  label="Gemini API Key"
                  type="password"
                  value={apiSettings.gemini_api_key}
                  onChange={(e) => setApiSettings({ ...apiSettings, gemini_api_key: e.target.value })}
                  sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
                <TextField
                  fullWidth
                  label="OpenAI API Key"
                  type="password"
                  value={apiSettings.openai_api_key}
                  onChange={(e) => setApiSettings({ ...apiSettings, openai_api_key: e.target.value })}
                  sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
                <TextField
                  fullWidth
                  label="ElevenLabs API Key"
                  type="password"
                  value={apiSettings.elevenlabs_api_key}
                  onChange={(e) => setApiSettings({ ...apiSettings, elevenlabs_api_key: e.target.value })}
                  sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#16213e' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Programación de Publicación
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#aaa' }}>Horarios de subida por defecto</InputLabel>
                  <Select
                    multiple
                    value={scheduleSettings.default_upload_times}
                    onChange={(e) => setScheduleSettings({ ...scheduleSettings, default_upload_times: e.target.value as string[] })}
                    sx={{ color: '#fff', bgcolor: '#1a1a2e' }}
                  >
                    <MenuItem value="06:00" sx={{ color: '#fff' }}>06:00 AM</MenuItem>
                    <MenuItem value="09:00" sx={{ color: '#fff' }}>09:00 AM</MenuItem>
                    <MenuItem value="12:00" sx={{ color: '#fff' }}>12:00 PM</MenuItem>
                    <MenuItem value="15:00" sx={{ color: '#fff' }}>03:00 PM</MenuItem>
                    <MenuItem value="18:00" sx={{ color: '#fff' }}>06:00 PM</MenuItem>
                    <MenuItem value="21:00" sx={{ color: '#fff' }}>09:00 PM</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Máximo de videos por día"
                  type="number"
                  value={scheduleSettings.max_videos_per_day}
                  onChange={(e) => setScheduleSettings({ ...scheduleSettings, max_videos_per_day: parseInt(e.target.value) })}
                  sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={scheduleSettings.auto_publish}
                      onChange={(e) => setScheduleSettings({ ...scheduleSettings, auto_publish: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Publicación automática"
                  sx={{ color: '#fff', mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={scheduleSettings.optimal_time_detection}
                      onChange={(e) => setScheduleSettings({ ...scheduleSettings, optimal_time_detection: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Detección automática de horarios óptimos"
                  sx={{ color: '#fff' }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#16213e' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Configuración de Generación
                </Typography>
                <TextField
                  fullWidth
                  label="Duración objetivo de videos (segundos)"
                  type="number"
                  defaultValue={60}
                  sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
                <TextField
                  fullWidth
                  label="Calidad de video"
                  select
                  defaultValue="high"
                  sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                >
                  <MenuItem value="low" sx={{ color: '#fff' }}>Baja</MenuItem>
                  <MenuItem value="medium" sx={{ color: '#fff' }}>Media</MenuItem>
                  <MenuItem value="high" sx={{ color: '#fff' }}>Alta</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Formato de salida"
                  select
                  defaultValue="mp4"
                  sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                >
                  <MenuItem value="mp4" sx={{ color: '#fff' }}>MP4</MenuItem>
                  <MenuItem value="webm" sx={{ color: '#fff' }}>WebM</MenuItem>
                </TextField>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#16213e' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Detección de Contenido
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.spam_detection_enabled}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, spam_detection_enabled: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Detección de spam"
                  sx={{ color: '#fff', mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.content_quality_check}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, content_quality_check: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Verificación de calidad de contenido"
                  sx={{ color: '#fff', mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.copyright_check}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, copyright_check: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Verificación de derechos de autor"
                  sx={{ color: '#fff', mb: 2, display: 'block' }}
                />
                <Divider sx={{ bgcolor: '#333', my: 2 }} />
                <TextField
                  fullWidth
                  label="Máximo de uploads diarios por canal"
                  type="number"
                  value={securitySettings.max_daily_uploads_per_channel}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, max_daily_uploads_per_channel: parseInt(e.target.value) })}
                  sx={{ '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#16213e' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Límites y Restricciones
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
                    Límite de cuota YouTube API
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>
                    10,000 unidades/día
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
                    Límite de requests por minuto
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>
                    60 requests/minuto
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
                    Estado del sistema
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#00ff00' }}>
                    ✅ Operativo
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Los límites se reinician diariamente a medianoche UTC
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#16213e' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Configuración de Notificaciones
                </Typography>
                <TextField
                  fullWidth
                  label="Email de notificaciones"
                  type="email"
                  value={notificationSettings.email_address}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, email_address: e.target.value })}
                  sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#aaa' } }}
                  InputProps={{ sx: { color: '#fff', bgcolor: '#1a1a2e' } }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.email_notifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, email_notifications: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Notificaciones por email"
                  sx={{ color: '#fff', mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.upload_complete}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, upload_complete: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Notificar cuando se complete un upload"
                  sx={{ color: '#fff', mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.error_alerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, error_alerts: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Alertas de error"
                  sx={{ color: '#fff', mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.weekly_reports}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, weekly_reports: e.target.checked })}
                      sx={{ color: '#fff' }}
                    />
                  }
                  label="Reportes semanales"
                  sx={{ color: '#fff', display: 'block' }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#16213e' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Historial de Notificaciones
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: '#1a1a2e', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#00ff00' }}>
                      ✅ Video subido exitosamente
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                      Hace 2 horas
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: '#1a1a2e', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#00ff00' }}>
                      ✅ Campaña creada
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                      Hace 5 horas
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: '#1a1a2e', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#ffff00' }}>
                      ⚠️ Cuota API casi al límite
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                      Hace 1 día
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          sx={{ bgcolor: '#ff0000', '&:hover': { bgcolor: '#cc0000' } }}
        >
          Guardar Configuración
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
