// Iconos válidos de Material-UI
// Esta lista ayuda a verificar que los iconos usados sean correctos

export const validIcons = {
  // Navegación
  Dashboard: 'Dashboard',
  YouTube: 'YouTube',
  Campaign: 'Campaign',
  Analytics: 'Analytics',
  TrendingUp: 'TrendingUp',
  Settings: 'Settings',
  Menu: 'Menu',
  
  // Acciones
  Add: 'Add',
  Delete: 'Delete',
  Edit: 'Edit',
  Refresh: 'Refresh',
  Save: 'Save',
  CheckCircle: 'CheckCircle',
  Error: 'Error',
  Pause: 'Pause',
  PlayArrow: 'PlayArrow',
  OpenInNew: 'OpenInNew',
  ContentCopy: 'ContentCopy',
  
  // Iconos específicos
  MovieCreation: 'MovieCreation',
  People: 'People',
  Schedule: 'Schedule',
  Money: 'Money',
  VideoLibrary: 'VideoLibrary',
  Visibility: 'Visibility',
  ThumbUp: 'ThumbUp',
  Lightbulb: 'Lightbulb',
  Code: 'Code', // en lugar de 'API'
  Security: 'Security',
  Notifications: 'Notifications',
  Storage: 'Storage',
  LocalFireDepartment: 'LocalFireDepartment', // en lugar de 'Fire'
  Stars: 'Stars', // en lugar de 'AutoAwesome'
  
  // Iconos alternativos si los anteriores no funcionan
  Whatshot: 'Whatshot', // alternativa a Fire
  IntegrationInstructions: 'IntegrationInstructions', // alternativa a API
  AutoFixHigh: 'AutoFixHigh', // alternativa a AutoAwesome
  TipsAndUpdates: 'TipsAndUpdates', // alternativa
};

// Iconos que NO existen en @mui/icons-material:
export const invalidIcons = [
  'Fire', // usar LocalFireDepartment o Whatshot
  'API', // usar Code o IntegrationInstructions
  'AutoAwesome', // usar Stars o AutoFixHigh
];
