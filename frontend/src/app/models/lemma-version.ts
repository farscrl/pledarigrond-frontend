import { User } from "./user";

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
  creatorRole?: string;
  internalId: number = 0;
  verifierId?: any;
  lexEntryId?: any;
}

export class LemmaValues {
  DStichwort?: string;
  DSubsemantik?: string;
  DGenus?: string;
  DTags?: string;
  RStichwort?: string;
  RFlex?: string;
  RTags?: string;
  RInflectionType?: string;
  RInflectionSubtype?: string;
  RSubsemantik?: string;
  RGenus?: string;
  contact_email?: string;
  contact_comment?: string;
  DRedirect?: string;
  RRedirect?: string;
  categories?: string;

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

  cundizionalsing1?: string;
  cundizionalsing2?: string;
  cundizionalsing3?: string;
  cundizionalplural1?: string;
  cundizionalplural2?: string;
  cundizionalplural3?: string;

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
