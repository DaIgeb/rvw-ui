import { TLogLevel } from '@app/core/logger.model';

export type TEnvironment = {
  production: boolean;
  test: boolean;
  auth: {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    AUDIENCE: string;
    REDIRECT: string;
    LOGOUT_URL: string;
    SCOPE: string;
  };
  api: {
    url: string;
  };
  log: {
    level: TLogLevel;
  };
  analytics: string;
};
