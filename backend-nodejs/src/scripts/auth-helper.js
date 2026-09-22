/**
 * Script de ayuda para autenticación con YouTube
 * Este script facilita el proceso de obtener tokens OAuth
 */

require('dotenv').config();
const { google } = require('googleapis');

class YouTubeAuthHelper {
  constructor() {
    if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET) {
      console.error('❌ Error: YOUTUBE_CLIENT_ID y YOUTUBE_CLIENT_SECRET deben estar configurados en .env');
      process.exit(1);
    }

    this.oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/oauth/callback'
    );

    this.scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ];
  }

  /**
   * Genera la URL de autorización
   */
  getAuthUrl() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      prompt: 'consent'
    });

    console.log('🔗 URL de Autorización:');
    console.log(authUrl);
    console.log('\n1. Copia esta URL y ábrela en tu navegador');
    console.log('2. Inicia sesión con tu cuenta de Google');
    console.log('3. Autoriza la aplicación');
    console.log('4. Copia el código de autorización de la URL de respuesta');
    
    return authUrl;
  }

  /**
   * Intercambia el código de autorización por tokens
   */
  async exchangeCodeForTokens(code) {
    try {
      console.log('🔄 Intercambiando código por tokens...');
      
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      console.log('✅ Tokens obtenidos exitosamente:');
      console.log('   Access Token:', tokens.access_token.substring(0, 20) + '...');
      console.log('   Refresh Token:', tokens.refresh_token ? tokens.refresh_token.substring(0, 20) + '...' : 'N/A');
      console.log('   Expira en:', tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString() : 'N/A');

      // Mostrar tokens completos (cuidado: no compartir en producción)
      console.log('\n📋 Tokens completos (para guardar en base de datos):');
      console.log(JSON.stringify(tokens, null, 2));

      return tokens;
    } catch (error) {
      console.error('❌ Error intercambiando código por tokens:', error.message);
      throw error;
    }
  }

  /**
   * Verifica si los tokens son válidos
   */
  async verifyTokens(tokens) {
    try {
      this.oauth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
      
      const response = await youtube.channels.list({
        part: 'snippet',
        mine: true
      });

      console.log('✅ Tokens válidos');
      console.log('📺 Canal conectado:', response.data.items[0].snippet.title);
      return true;
    } catch (error) {
      console.error('❌ Tokens inválidos o expirados:', error.message);
      return false;
    }
  }

  /**
   * Refresca el access token usando el refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      console.log('🔄 Refrescando access token...');
      
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      console.log('✅ Access token refrescado exitosamente');
      console.log('   Nuevo Access Token:', credentials.access_token.substring(0, 20) + '...');
      console.log('   Expira en:', credentials.expiry_date ? new Date(credentials.expiry_date).toLocaleString() : 'N/A');

      return credentials;
    } catch (error) {
      console.error('❌ Error refrescando token:', error.message);
      throw error;
    }
  }
}

// CLI para facilitar el uso
const authHelper = new YouTubeAuthHelper();
const command = process.argv[2];

switch (command) {
  case 'auth-url':
    authHelper.getAuthUrl();
    break;
  
  case 'exchange':
    const code = process.argv[3];
    if (!code) {
      console.error('❌ Error: Debes proporcionar el código de autorización');
      console.log('Uso: node auth-helper.js exchange <codigo_autorizacion>');
      process.exit(1);
    }
    authHelper.exchangeCodeForTokens(code);
    break;
  
  case 'verify':
    console.log('⚠️  Esta función requiere tokens guardados. Implementa el almacenamiento de tokens primero.');
    break;
  
  case 'refresh':
    const refreshToken = process.argv[3];
    if (!refreshToken) {
      console.error('❌ Error: Debes proporcionar el refresh token');
      console.log('Uso: node auth-helper.js refresh <refresh_token>');
      process.exit(1);
    }
    authHelper.refreshAccessToken(refreshToken);
    break;
  
  default:
    console.log('📖 YouTube Auth Helper - Uso:');
    console.log('');
    console.log('Generar URL de autorización:');
    console.log('  node auth-helper.js auth-url');
    console.log('');
    console.log('Intercambiar código por tokens:');
    console.log('  node auth-helper.js exchange <codigo_autorizacion>');
    console.log('');
    console.log('Refrescar access token:');
    console.log('  node auth-helper.js refresh <refresh_token>');
    console.log('');
    console.log('Ejemplo completo:');
    console.log('  1. node auth-helper.js auth-url');
    console.log('  2. Abre la URL en el navegador y autoriza');
    console.log('  3. Copia el código de la respuesta');
    console.log('  4. node auth-helper.js exchange <codigo>');
}

module.exports = YouTubeAuthHelper;
