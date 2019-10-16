export const environment = {
  production: true,
  auth: {
    CLIENT_ID: 'NBBkdTDcCp2MW07SHvU743q4W505iFtR',
    CLIENT_DOMAIN: 'rvw.eu.auth0.com', // e.g., 'you.auth0.com'
    AUDIENCE: 'https://api.aws.daigeb.ch',
    REDIRECT: 'http://localhost:4200/callback',
    LOGOUT_URL: 'http://localhost:4200'
  },
  api: {
    roles: '',
    url: 'https://api.aws.daigeb.ch'
  }
};
