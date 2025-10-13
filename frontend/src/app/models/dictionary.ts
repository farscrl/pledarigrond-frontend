export class EntryVersionDto {
  versionId!: string;
  entryId!: string;
  action!: Action;

  // info romansh
  rmStichwort?: string;
  rmStichwortSort?: string;
  rmSemantik?: string;
  rmSubsemantik?: string;
  rmGrammatik?: string;
  rmGenus?: string;
  rmFlex?: string;
  rmTags?: string;
  rmRedirect?: string;
  rmEtymologie?: string;
  rmPronunciation?: string;
  inflection?: Inflection;

  // info german
  deStichwort?: string;
  deStichwortSort?: string;
  deSemantik?: string;
  deSubsemantik?: string;
  deGrammatik?: string;
  deGenus?: string;
  deTags?: string;
  deRedirect?: string;

  // general info
  categories?: string;
  examples: Example[] = [];
  userComment?: string;
  userEmail?: string;
}


export class Example {
  rm!: string;
  de?: string;
}

export class Inflection {
  inflectionType?: InflectionType;
  inflectionSubtype?: string;

  // These types (Verb, Noun, Adjective, Pronoun, Other) should be defined elsewhere in your codebase.
  verb?: Verb;
  noun?: Noun;
  adjective?: Adjective;
  pronoun?: Pronoun;
  other?: Other;
}

export class Verb {
  infinitiv?: string;
  irregular?: boolean;
  composedWith?: string;

  preschent?: PersonalVerb;
  imperfect?: PersonalVerb;
  conjunctiv?: PersonalVerb;
  conjunctivImperfect?: PersonalVerb;
  cundiziunal?: PersonalVerb;
  cundiziunalIndirect?: PersonalVerb;
  participPerfect?: ParticipPerfect;
  imperativ?: Imperativ;
  gerundium?: string;
  futur?: PersonalVerb;
  futurDubitativ?: PersonalVerb;

  preschentEnclitic?: PersonalVerbEnclitic;
  imperfectEnclitic?: PersonalVerbEnclitic;
  cundiziunalEnclitic?: PersonalVerbEnclitic;
  futurEnclitic?: PersonalVerbEnclitic;
  futurDubitativEnclitic?: PersonalVerbEnclitic;
}

export class PersonalVerb {
  sing1?: string;
  sing2?: string;
  sing3?: string;
  plural1?: string;
  plural2?: string;
  plural3?: string;
}

export class PersonalVerbEnclitic {
  sing1?: string;
  sing2?: string;
  sing3m?: string;
  sing3f?: string;
  plural1?: string;
  plural2?: string;
  plural3?: string;
}

export class ParticipPerfect {
  ms?: string;
  fs?: string;
  mp?: string;
  fp?: string;
  msPredicativ?: string;
}

export class Imperativ {
  singular?: string;
  plural?: string;
  form3?: string;
  form4?: string;
  form5?: string;
  form6?: string;
}

export class Noun {
  baseForm?: string;
  mSingular?: string;
  fSingular?: string;
  mPlural?: string;
  fPlural?: string;
  pluralCollectiv?: string;
}

export class Adjective {
  baseForm?: string;
  mSingular?: string;
  fSingular?: string;
  mPlural?: string;
  fPlural?: string;
  adverbialForm?: string;
}

export class Pronoun {
  baseForm?: string;
  mSingular?: string;
  fSingular?: string;
  mPlural?: string;
  fPlural?: string;
}

export class Other {
  baseForm?: string;
  otherForm1?: string;
  otherForm2?: string;
  otherForm3?: string;
  otherForm4?: string;
}

export type InflectionType = 'NONE'|'VERB'|'NOUN'|'ADJECTIVE'|'PRONOUN'|'OTHER';

export type Action = | 'SUGGESTED_ENTRY' | 'ACCEPTED_ENTRY' | 'CREATED_ENTRY' | 'SUGGESTED_MODIFICATION' | 'ACCEPTED_MODIFICATION' | 'REFUSED_MODIFICATION' | 'CREATED_MODIFICATION' | 'CHANGED_ORDER' | 'UNKNOWN';
