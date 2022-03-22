export enum Role {
  ROLE_ADMIN,
  ROLE_INTERNAL,
  ROLE_EXTERNAL,
  ROLE_GUEST,
}

export enum Language {
  PUTER,
  RUMANTSCHGRISCHUN,
  SURMIRAN,
  SURSILVAN,
  SUTSILVAN,
  VALLADER,
}

export class Credentials {
  username: string = "";
  password: string = "";
}
