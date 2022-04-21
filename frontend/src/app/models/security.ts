export type Role =
  'ROLE_ADMIN' |
  'ROLE_EDITOR_PUTER' |
  'ROLE_EDITOR_RUMANTSCHGRISCHUN' |
  'ROLE_EDITOR_SURMIRAN' |
  'ROLE_EDITOR_SURSILVAN' |
  'ROLE_EDITOR_SUTSILVAN' |
  'ROLE_EDITOR_VALLADER' |
  'ROLE_EDITOR_NAMES';

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
