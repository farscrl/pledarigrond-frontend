export class User {
  email: string = "";
  password?: string = "";
  admin: boolean = false;

  roles: Roles = new Roles();

  creationDate: number = 0;
  lastModificationDate: number = 0;
}

export class Roles {
  puterRole: EditorRole = 'NONE';
  rumantschgrischunRole: EditorRole = 'NONE';
  surmiranRole: EditorRole = 'NONE';
  sursilvanRole: EditorRole = 'NONE';
  sutsilvanRole: EditorRole = 'NONE';
  valladerRole: EditorRole = 'NONE';

  namesRole: EditorRole = 'NONE';
}

export type EditorRole = 'INTERNAL'|'EXTERNAL'|'NONE';
