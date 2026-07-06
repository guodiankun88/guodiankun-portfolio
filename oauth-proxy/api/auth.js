// Decap CMS GitHub OAuth proxy - /auth endpoint
module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUrl = process.env.REDIRECT_URL;

  if (!clientId || !redirectUrl) {
    res.status(500).send('Missing GITHUB_CLIENT_ID or REDIRECT_URL environment variables');
    return;
  }

  const callbackUrl = new URL('/callback', redirectUrl).toString();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'repo',
    state: Math.random().toString(36).substring(2)
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  res.writeHead(302, { Location: authUrl });
  res.end();
};
