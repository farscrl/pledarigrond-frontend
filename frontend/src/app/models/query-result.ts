import { LemmaVersion } from "./lemma-version";

export class QueryResult {
  entries: LemmaVersion[] = [];
  totalEntries: number = 0;
  pageSize: number = 1;
}
