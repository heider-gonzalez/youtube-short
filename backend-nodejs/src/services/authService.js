const { google } = require('googleapis');
const logger = require('../utils/logger');

class AuthService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );

        // Configurar scopes de YouTube
        this.scopes = [
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/yt-analytics.readonly'
        ];
    }

    getAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
            prompt: 'consent'
        });
    }

    async authenticate(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            
            logger.info('Autenticación exitosa con YouTube');
            return tokens;
        } catch (error) {
            logger.error('Error en autenticación:', error);
            throw error;
        }
    }

    async refreshTokens(refreshToken) {
        try {
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken
            });

            const { credentials } = await this.oauth2Client.refreshAccessToken();
            return credentials;
        } catch (error) {
            logger.error('Error refrescando tokens:', error);
            throw error;
        }
    }

    isAuthenticated() {
        return this.oauth2Client.credentials.access_token !== undefined;
    }
}

module.exports = new AuthService();
