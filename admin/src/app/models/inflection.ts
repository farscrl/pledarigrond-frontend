export type InflectionType = 'VERB'|'NOUN'|'ADJECTIVE'|undefined;

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
