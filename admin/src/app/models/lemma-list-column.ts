export class LemmaListColumn {
  // Infos about the creation of the lex entry
  user: LemmaListColumnDetail = new LemmaListColumnDetail();
  verifier: LemmaListColumnDetail = new LemmaListColumnDetail();
  filter: LemmaListColumnDetail = new LemmaListColumnDetail();
  entry: LemmaListColumnDetail = new LemmaListColumnDetail();
  actions: LemmaListColumnDetail = new LemmaListColumnDetail();
  order: LemmaListColumnDetail = new LemmaListColumnDetail();
  state: LemmaListColumnDetail = new LemmaListColumnDetail();
  created: LemmaListColumnDetail = new LemmaListColumnDetail();

  // Infos about the lemma itself
  german: LemmaListColumnDetail = new LemmaListColumnDetail();
  germanGrammar: LemmaListColumnDetail = new LemmaListColumnDetail();
  germanGender: LemmaListColumnDetail = new LemmaListColumnDetail();
  germanSemantics: LemmaListColumnDetail = new LemmaListColumnDetail();
  germanLink: LemmaListColumnDetail = new LemmaListColumnDetail();
  romansh: LemmaListColumnDetail = new LemmaListColumnDetail();
  romanshGrammar: LemmaListColumnDetail = new LemmaListColumnDetail();
  romanshGender: LemmaListColumnDetail = new LemmaListColumnDetail();
  romanshSemantics: LemmaListColumnDetail = new LemmaListColumnDetail();
  romanshLink: LemmaListColumnDetail = new LemmaListColumnDetail();
  romanshConjugation: LemmaListColumnDetail = new LemmaListColumnDetail();
  romanshAdditionalSearchTerms: LemmaListColumnDetail = new LemmaListColumnDetail();
  category: LemmaListColumnDetail = new LemmaListColumnDetail();
  comment: LemmaListColumnDetail = new LemmaListColumnDetail();

  // commands
  checkMultiple: LemmaListColumnDetail = new LemmaListColumnDetail();
}

export class LemmaListColumnDetail {
  allowed = false;
  active = false;

  constructor(allowed: boolean = false, active: boolean = false) {
    this.allowed = allowed;
    this.active = active;
  }
}
