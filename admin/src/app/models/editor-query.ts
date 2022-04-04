import { Status, Verification } from "./lemma-version"

export class EditorQuery {
  state?: Status[]/* = ['NEW_ENTRY', 'NEW_MODIFICATION']*/;
  userOrIp?: string;
  startTime?: number;
  endTime?: number;
  verification?: Verification;
}
