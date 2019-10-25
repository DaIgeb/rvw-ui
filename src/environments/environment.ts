import { Environment } from './model';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: Environment = {
  production: false,
  test: true,
  auth: {
    CLIENT_ID: 'NBBkdTDcCp2MW07SHvU743q4W505iFtR',
    CLIENT_DOMAIN: 'rvw.eu.auth0.com', // e.g., 'you.auth0.com'
    AUDIENCE: 'https://api.aws.daigeb.ch',
    REDIRECT: 'http://localhost:4200/callback',
    LOGOUT_URL: 'http://localhost:4200',
    SCOPE: 'openid profile email'
  },
  api: {
    url: 'https://dev.api.aws.daigeb.ch'
  },
  log: {
    level: 'log'
  },
  analytics: 'UA-150593477-1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
