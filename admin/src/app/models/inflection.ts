export type InflectionType = 'V'|'NOUN'|'ADJECTIVE'|'PRONOUN'|undefined;

export class InflectionSubType {
  id: string = "";
  name: string = "";
  description: string = "";
  isSubtype: boolean = false;
}

export class InflectionResponse {
  inflectionSubType: InflectionSubType = new InflectionSubType();
  inflectionValues: any;
}
