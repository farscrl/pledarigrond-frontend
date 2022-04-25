import { Status, Verification } from "./lemma-version"

export class EditorQuery {
  state?: Status[];
  userOrIp?: string;
  startTime?: number;
  endTime?: number;
  verification?: Verification;
  verifier?: string;

  // only set to fix linting error in template. fields can't be used.
  searchPhrase = "";
  highlight = false;
}
