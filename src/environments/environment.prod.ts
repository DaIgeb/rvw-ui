import { TEnvironment } from './model';

export const environment: TEnvironment = {
  production: true,
  test: false,
  auth: {
    CLIENT_ID: 'NBBkdTDcCp2MW07SHvU743q4W505iFtR',
    CLIENT_DOMAIN: 'rvw.eu.auth0.com', // e.g., 'you.auth0.com'
    AUDIENCE: 'https://api.aws.daigeb.ch',
    REDIRECT: 'https://rvw.cycled.ch/callback',
    LOGOUT_URL: 'https://rvw.cycled.ch',
    SCOPE: 'openid profile email'
  },
  api: {
    url: 'https://api.aws.daigeb.ch'
  },
  log: {
    level: 'error'
  }
};
