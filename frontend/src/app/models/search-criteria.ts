export class SearchCriteria {
  searchPhrase: string = "";
  searchDirection: SearchDirection = 'BOTH';
  searchMethod: SearchMethod = 'NORMAL';
  highlight: boolean = false;
  suggestions: boolean = false;
}

export type SearchDirection = 'BOTH'|'ROMANSH'|'GERMAN';
export type SearchMethod = 'NORMAL'|'INTERN'|'PREFIX'|'SUFFIX'|'EXACT';

export class SearchCriteriaUrl {
  searchPhrase: string | null = null;
  searchDirection: 'romansh' | 'german' | null = null;
  searchMethod: 'intern' | 'prefix' | 'suffix' | 'exact' | null = null;
  highlight: boolean | null = null;
  suggestions: boolean | null = null;
}
