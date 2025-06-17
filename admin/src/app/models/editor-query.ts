import { PublicationStatus } from './dictionary';

export class EditorQuery {
  state?: PublicationStatus;
  userOrIp?: string;
  verifier?: string;
  role?: string;
  startTime?: number;
  endTime?: number;

  // only set to fix linting error in template. fields can't be used.
  searchPhrase = "";
  highlight = false;
}
