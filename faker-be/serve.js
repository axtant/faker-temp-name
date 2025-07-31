const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// Utility: Fetch wrapper
const request = async (url, options = {}) => {
  const fetch = (await import('node-fetch')).default;
  return fetch(url, options);
};

// Steam: Verify OpenID response
const verifySteamAuth = async (params) => {
  const verifyParams = { ...params, 'openid.mode': 'check_authentication' };
  const body = querystring.stringify(verifyParams);
  
  try {
    const response = await request('https://steamcommunity.com/openid/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const result = await response.text();
    return result.includes('is_valid:true');
  } catch (error) {
    console.error('Steam verification failed:', error);
    return false;
  }
};

// Steam: Get user data
const getSteamUser = async (steamId) => {
  try {
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`;
    const response = await request(url);
    const data = await response.json();
    return data.response.players[0] || null;
  } catch (error) {
    console.error('Steam API error:', error);
    return null;
  }
};

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/auth/steam', async (req, res) => {
  try {
    const { openidParams } = req.body;
    
    // Verify Steam response
    const isValid = await verifySteamAuth(openidParams);
    if (!isValid) {
      return res.status(400).json({ error: 'Steam verification failed' });
    }
    
    // Extract Steam ID
    const steamId = openidParams['openid.claimed_id']?.split('/').pop();
    if (!steamId) {
      return res.status(400).json({ error: 'Invalid Steam ID' });
    }
    
    // Get user data
    const userData = await getSteamUser(steamId);
    if (!userData) {
      return res.status(400).json({ error: 'Failed to fetch user data' });
    }
    
    // Create JWT
    const token = jwt.sign(
      { steamId: userData.steamid, name: userData.personaname },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        id: userData.steamid,
        name: userData.personaname,
        avatar: userData.avatarfull,
        profileUrl: userData.profileurl
      }
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.get('/api/user', authenticate, async (req, res) => {
  try {
    const userData = await getSteamUser(req.user.steamId);
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: userData.steamid,
      name: userData.personaname,
      avatar: userData.avatarfull,
      profileUrl: userData.profileurl,
      realName: userData.realname,
      country: userData.loccountrycode
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});