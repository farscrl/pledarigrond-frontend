export class SearchCriteria {
  searchPhrase: string = "";
  searchDirection: SearchDirection = 'BOTH';
  searchMethod: SearchMethod = 'NORMAL';
  highlight: boolean = false;
  suggestions: boolean = false;
}

export class EditorSearchCriteria extends SearchCriteria {
  category: string = "";
  subSemantics: string = "";
  gender: string = "";
  grammar: string = "";
}

export type SearchDirection = 'BOTH'|'ROMANSH'|'GERMAN';
export type SearchMethod = 'NORMAL'|'INTERN'|'PREFIX'|'SUFFIX'|'EXACT';
