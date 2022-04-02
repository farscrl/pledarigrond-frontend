import { LemmaVersion } from "./lemma-version";

export class LexEntry {
  versionHistory: LemmaVersion[] = [];
  currentId: number = 0;
  id: string = "";
}

export class LexEntryUi extends LexEntry {
  disabled: boolean = false;
}
