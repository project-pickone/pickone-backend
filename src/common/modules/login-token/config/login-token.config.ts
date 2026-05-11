export default () => ({
  loginToken: {
    secret: process.env.LOGIN_TOKEN_SECRET || 'default_login_token_secret',
    expiresIn: process.env.LOGIN_TOKEN_EXPIRES_IN || '3d',
  },
});
