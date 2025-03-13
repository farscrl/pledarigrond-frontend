import { PublicationStatus, VersionStatus } from "./lemma-version"

export class EditorQuery {
  state?: PublicationStatus[];
  userOrIp?: string;
  verifier?: string;
  role?: string;
  versionStatus?: VersionStatus;
  startTime?: number;
  endTime?: number;

  // only set to fix linting error in template. fields can't be used.
  searchPhrase = "";
  highlight = false;
}
