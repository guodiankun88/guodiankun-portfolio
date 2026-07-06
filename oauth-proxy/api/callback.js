// Decap CMS GitHub OAuth proxy - /callback endpoint
const axios = require('axios');

module.exports = async (req, res) => {
  const code = req.query.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUrl = process.env.REDIRECT_URL;

  if (!code) {
    res.status(400).send('Missing authorization code');
    return;
  }

  if (!clientId || !clientSecret || !redirectUrl) {
    res.status(500).send('Missing environment variables');
    return;
  }

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: new URL('/callback', redirectUrl).toString()
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );

    const tokenData = tokenRes.data;

    if (tokenData.error) {
      res.status(400).send(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
      return;
    }

    const accessToken = tokenData.access_token;

    // Return a page that posts the token back to Decap CMS opener
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>登录中…</title>
</head>
<body>
  <script>
    (function() {
      function recieveMessage(e) {
        if (e.data === 'authorizing:github') {
          window.opener.postMessage(
            'authorization:github:success:{"token":"${accessToken}","provider":"github"}',
            e.origin
          );
        }
      }
      window.addEventListener('message', recieveMessage, false);
      window.opener && window.opener.postMessage('authorizing:github', '*');
    })();
  </script>
  <p style="text-align:center;font-family:sans-serif;margin-top:40px;color:#666;">
    登录成功，正在跳转回后台…
  </p>
</body>
</html>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to exchange authorization code for access token');
  }
};
