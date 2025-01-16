import { API_URL, GOOGLE_CLIENT_ID } from '@env';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';


export async function loginGoogle () {
    try {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(`${API_URL}/oauth/callback`)}` +
            `&response_type=code` +
            `&scope=${encodeURIComponent('email profile')}`;

        // Open browser for Google login
        const result = await WebBrowser.openAuthSessionAsync(
            googleAuthUrl,
            `${API_URL}/oauth/callback`
        );

        if (result.type === 'success') {
            // Extract the auth code from URL
            const url = new URL(result.url);
            const code = url.searchParams.get('code');
            
            // Get session token from backend
            const response = await fetch(`${API_URL}/oauth/callback?code=${code}`);
            const data = await response.json();
            
            // Store the session token
            await SecureStore.setItemAsync('sessionToken', data.session_token);
            console.log('Logged in successfully');
        }
    } catch (error) {
      console.error('Login failed: ' + error.message);
    }
    return null;
};

export async function checkSession() {
    try {
      const sessionToken = await SecureStore.getItemAsync('sessionToken');
      if (!sessionToken) {
        console.warn('No session found');
        return;
      }

      const response = await fetch(`${API_URL}/api/me`, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      const data = await response.json();
      console.log(`Session active for: ${data.email}`);
    } catch (error) {
      console.error('Session check failed: ' + error.message);
    }
    return null;
};

export async function logoutGoogle() {
    try {
      const sessionToken = await SecureStore.getItemAsync('sessionToken');
      if (sessionToken) {
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        });
        await SecureStore.deleteItemAsync('sessionToken');
        console.log('Logged out successfully');
      } else {
        console.log('No session to logout');
      }
    } catch (error) {
      console.error('Logout failed: ' + error.message);
    }
    return null;
};