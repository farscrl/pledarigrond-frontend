export class User {
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  password?: string = "";
  admin: boolean = false;

  roles: Roles = new Roles();

  creationDate: number = 0;
  lastModificationDate: number = 0;
}

export class Roles {
  rolePuter: EditorRole = 'NONE';
  roleRumantschGrischun: EditorRole = 'NONE';
  roleSurmiran: EditorRole = 'NONE';
  roleSursilvan: EditorRole = 'NONE';
  roleSutsilvan: EditorRole = 'NONE';
  roleVallader: EditorRole = 'NONE';

  roleNames: EditorRole = 'NONE';
  roleRegistrations: EditorRole = 'NONE'
}

export type EditorRole = 'ADMIN'|'EDITOR'|'GUEST'|'NONE';
