import { EditorRole, User } from "./user";

export class LemmaVersion {
  userInfo?: User;
  lemmaValues: LemmaValues = new LemmaValues();
  pgValues: PgValues = new PgValues();
  ip?: string;
  timestamp: number = 0;
  userId?: string;
  status: Status = 'UNDEFINED';
  approved: boolean = false;
  verification: Verification = 'UNVERIFIED';
  creatorRole?: EditorRole;
  internalId: number = 0;
  verifierId?: any;
  lexEntryId?: any;
}

export class LemmaVersionUi extends LemmaVersion {
  selected: boolean = false;
  local_review_status: 'ACCEPTED'|'REJECTED'|'EDITED'|'LATER'|'UNDEFINED' = 'UNDEFINED';
}

export class LemmaValues {
  DStichwort?: string;
  DGrammatik?: string;
  DSubsemantik?: string;
  DGenus?: string;
  DTags?: string;

  RStichwort?: string;
  RGrammatik?: string;
  RFlex?: string;
  RTags?: string;
  RInflectionType?: string;
  RInflectionSubtype?: string;
  RRegularInflection?: string;
  RSubsemantik?: string;
  RGenus?: string;
  contact_email?: string;
  contact_comment?: string;
  DRedirect?: string;
  RRedirect?: string;
  categories?: string;
  REtymologie?: string;

  examples?: string;

  infinitiv?: string;

  preschentsing1?: string;
  preschentsing2?: string;
  preschentsing3?: string;
  preschentplural1?: string;
  preschentplural2?: string;
  preschentplural3?: string;

  imperfectsing1?: string;
  imperfectsing2?: string;
  imperfectsing3?: string;
  imperfectplural1?: string;
  imperfectplural2?: string;
  imperfectplural3?: string;

  participperfectms?: string;
  participperfectfs?: string;
  participperfectmp?: string;
  participperfectfp?: string;

  conjunctivsing1?: string;
  conjunctivsing2?: string;
  conjunctivsing3?: string;
  conjunctivplural1?: string;
  conjunctivplural2?: string;
  conjunctivplural3?: string;

  conjunctiv2sing1?: string;
  conjunctiv2sing2?: string;
  conjunctiv2sing3?: string;
  conjunctiv2plural1?: string;
  conjunctiv2plural2?: string;
  conjunctiv2plural3?: string;

  conjunctivimperfectsing1?: string;
  conjunctivimperfectsing2?: string;
  conjunctivimperfectsing3?: string;
  conjunctivimperfectplural1?: string;
  conjunctivimperfectplural2?: string;
  conjunctivimperfectplural3?: string;

  cundizionalsing1?: string;
  cundizionalsing2?: string;
  cundizionalsing3?: string;
  cundizionalplural1?: string;
  cundizionalplural2?: string;
  cundizionalplural3?: string;

  cundizionalindirectsing1?: string;
  cundizionalindirectsing2?: string;
  cundizionalindirectsing3?: string;
  cundizionalindirectplural1?: string;
  cundizionalindirectplural2?: string;
  cundizionalindirectplural3?: string;

  futursing1?: string;
  futursing2?: string;
  futursing3?: string;
  futurplural1?: string;
  futurplural2?: string;
  futurplural3?: string;

  futurdubitativsing1?: string;
  futurdubitativsing2?: string;
  futurdubitativsing3?: string;
  futurdubitativplural1?: string;
  futurdubitativplural2?: string;
  futurdubitativplural3?: string;

  imperativ1?: string;
  imperativ2?: string;
  imperativ3?: string;
  imperativ4?: string;
  imperativ5?: string;
  imperativ6?: string;

  gerundium?: string;
  composedWith?: string;

  preschentsing1enclitic?: string;
  preschentsing2enclitic?: string;
  preschentsing3encliticm?: string;
  preschentsing3encliticf?: string;
  preschentplural1enclitic?: string;
  preschentplural2enclitic?: string;
  preschentplural3enclitic?: string;

  imperfectsing1enclitic?: string;
  imperfectsing2enclitic?: string;
  imperfectsing3encliticm?: string;
  imperfectsing3encliticf?: string;
  imperfectplural1enclitic?: string;
  imperfectplural2enclitic?: string;
  imperfectplural3enclitic?: string;

  cundizionalsing1enclitic?: string;
  cundizionalsing2enclitic?: string;
  cundizionalsing3encliticm?: string;
  cundizionalsing3encliticf?: string;
  cundizionalplural1enclitic?: string;
  cundizionalplural2enclitic?: string;
  cundizionalplural3enclitic?: string;

  futursing1enclitic?: string;
  futursing2enclitic?: string;
  futursing3encliticm?: string;
  futursing3encliticf?: string;
  futurplural1enclitic?: string;
  futurplural2enclitic?: string;
  futurplural3enclitic?: string;

  futurdubitativsing1enclitic?: string;
  futurdubitativsing2enclitic?: string;
  futurdubitativsing3encliticm?: string;
  futurdubitativsing3encliticf?: string;
  futurdubitativplural1enclitic?: string;
  futurdubitativplural2enclitic?: string;
  futurdubitativplural3enclitic?: string;

  // noun
  baseForm?: string;
  mSingular?: string;
  fSingular?: string;
  mPlural?: string;
  fPlural?: string;
  pluralCollectiv?: string;

  // adjective
  adverbialForm?: string;

  // other
  otherForm1?: string;
  otherForm2?: string;
  otherForm3?: string;
  otherForm4?: string;

  // pronunciation
  RPronunciation?: string;
}

export class PgValues {
  timestamp?: number;
  internal_id?: number;
  creator?: string;
  user_ip?: string;
  verification: Verification = 'UNVERIFIED';
  status: Status = 'UNDEFINED';
  creator_role?: String;
}

export type Status = 'DELETED'|'NEW_ENTRY'|'NEW_MODIFICATION'|'UNDEFINED';
export type Verification = 'REJECTED'|'ACCEPTED'|'OUTDATED'|'UNVERIFIED';
