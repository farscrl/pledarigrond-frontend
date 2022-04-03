import { User } from "./user";

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
  creatorRole?: string;
  internalId: number = 0;
  verifierId?: any;
  lexEntryId?: any;
}

export class EntryValues {
  DStichwort?: string;
  DSubsemantik?: string;
  DGenus?: string;
  RStichwort?: string;
  RFlex?: string;
  RSubsemantik?: string;
  RGenus?: string;
  maalr_overlay_lang2?: string;
  maalr_email?: string;
  comment?: string;
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
