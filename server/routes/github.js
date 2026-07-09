import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    res.json({ accessToken: tokenRes.data.access_token });
  } catch (err) {
    console.error('GitHub token error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});


router.get('/repos', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

router.post('/collaborate', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const { repo } = req.body;

  const username = repo.split('/')[0];
  const repoName = repo.split('/')[1];

  const botUsername = 'wiecodes'; // Replace this with your GitHub username

  try {
    await axios.put(
      `https://api.github.com/repos/${username}/${repoName}/collaborators/${botUsername}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Collab Error:', err.response?.data || err.message); // 👈 Add this
    res.status(500).json({ error: 'Collaboration failed' });
  }
});


export default router;
