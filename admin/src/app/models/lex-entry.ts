import { LemmaVersion, Status } from "./lemma-version";

export class LexEntry {
  versionHistory: LemmaVersion[] = [];
  currentId: number = 0;
  current: LemmaVersion = new LemmaVersion();
  id: string = "";
  changeStamp: string = "";
  status: Status = 'UNDEFINED';
  mostRecent: LemmaVersion = new LemmaVersion();
  unapprovedVersion: LemmaVersion[] = [];
  nextInternalId?: number;
}

export class LexEntryUi extends LexEntry {
  disabled: boolean = false;
}
