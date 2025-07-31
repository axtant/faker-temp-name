const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async steamLogin() {
    const returnUrl = `${window.location.origin}/auth/callback`;
    const steamUrl = 
      'https://steamcommunity.com/openid/login?' +
      `openid.ns=http://specs.openid.net/auth/2.0&` +
      `openid.mode=checkid_setup&` +
      `openid.return_to=${encodeURIComponent(returnUrl)}&` +
      `openid.realm=${encodeURIComponent(window.location.origin)}&` +
      `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
      `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;
    
    window.location.href = steamUrl;
  }

  async handleCallback(searchParams) {
    const openidParams = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('openid.')) {
        openidParams[key] = value;
      }
    }

    const response = await fetch(`${API_URL}/api/auth/steam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ openidParams })
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('token', this.token);
    return data.user;
  }

  async getUser() {
    if (!this.token) return null;

    const response = await fetch(`${API_URL}/api/user`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (!response.ok) {
      this.logout();
      return null;
    }

    return response.json();
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new AuthService();