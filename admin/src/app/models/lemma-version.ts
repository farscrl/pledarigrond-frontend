import { EditorRole, User } from "./user";

export class LemmaVersion {
  userInfo?: User;
  entryValues: EntryValues = new EntryValues();
  maalrValues: MaalrValues = new MaalrValues();
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

export class EntryValues {
  DStichwort?: string;
  DGrammatik?: string;
  DSubsemantik?: string;
  DGenus?: string;
  RStichwort?: string;
  RGrammatik?: string;
  RFlex?: string;
  RTags?: string;
  RSubsemantik?: string;
  RGenus?: string;
  rm_flex_type?: string;
  maalr_email?: string;
  maalr_comment?: string;
  redirect_a?: string;
  redirect_b?: string;
  Bearbeitungshinweis?: string;

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

  imperativ1?: string;
  imperativ2?: string;

  gerundium?: string;
}

export class MaalrValues {
  maalr_timestamp?: number;
  internal_id?: number;
  maalr_creator?: string;
  maalr_ip?: string;
  maalr_verification: Verification = 'UNVERIFIED';
  maalr_status: Status = 'UNDEFINED';
  maalr_creator_role?: String;
}

export type Status = 'DELETED'|'NEW_ENTRY'|'NEW_MODIFICATION'|'UNDEFINED';
export type Verification = 'REJECTED'|'ACCEPTED'|'OUTDATED'|'UNVERIFIED';
