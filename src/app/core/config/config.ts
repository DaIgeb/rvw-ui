import { TLogLevel } from '../logger.model';

export interface Config {
  usersUrl: string;
  routesUrl: string;
  membersUrl: string;
  toursUrl: string;
  locationsUrl: string;
  fileUrl: string;
  logLevel: TLogLevel;
}
