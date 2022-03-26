export enum Role {
  ROLE_ADMIN,
  ROLE_INTERNAL,
  ROLE_EXTERNAL,
  ROLE_GUEST,
}

export enum Language {
  PUTER = "puter",
  RUMANTSCHGRISCHUN = "rumantschgrischun",
  SURMIRAN = "surmiran",
  SURSILVAN = "sursilvan",
  SUTSILVAN = "sutsilvan",
  VALLADER = "vallader",
}

export class Credentials {
  username: string = "";
  password: string = "";
}
