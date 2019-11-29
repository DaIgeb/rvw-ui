import { TLogLevel } from '../logger.model';

export interface Config {
  usersUrl: string;
  routesUrl: string;
  seasonsUrl: string;
  membersUrl: string;
  toursUrl: string;
  locationsUrl: string;
  fileUrl: string;
  logLevel: TLogLevel;
}
