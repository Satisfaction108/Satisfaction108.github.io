const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('No code provided');
    }

    const params = new URLSearchParams();
    params.append('client_id', '1283103158012219455');
    params.append('client_secret', 'cD87ozdWgQqaPhqtcH6_Ji7hkUMZVZLq');
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'https://satisfaction108.github.io');

    try {
        // Exchange the code for an access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return res.status(400).send(`Error: ${tokenData.error_description}`);
        }

        const accessToken = tokenData.access_token;

        // Use the access token to get user info
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userData = await userResponse.json();

        // Send the user data as response
        res.status(200).json({
            username: userData.username,
            avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
        });
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
};
