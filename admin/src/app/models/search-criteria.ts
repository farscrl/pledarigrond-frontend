export class SearchCriteria {
  searchPhrase: string = "";
  searchDirection: SearchDirection = 'BOTH';
  searchMethod: SearchMethod = 'NORMAL';
  highlight: boolean = false;
}

export class EditorSearchCriteria extends SearchCriteria {
  category: string = "";
  subSemantics: string = "";
  gender: string = "";
  grammar: string = "";
  onlyAutomaticChanged: boolean = false;
  excludeAutomaticChanged: boolean = false;
  automaticChangesType: AutomaticChangesType = 'ALL';
  showReviewLater?: boolean;
}

export type SearchDirection = 'BOTH'|'ROMANSH'|'GERMAN';
export type SearchMethod = 'NORMAL'|'INTERN'|'PREFIX'|'SUFFIX'|'EXACT';
export type AutomaticChangesType = 'ALL'|'VERBS'|'NOUNS'|'ADJECTIVES';
