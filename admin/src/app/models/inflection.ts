export type InflectionType = 'VERB'|'NOUN'|'ADJECTIVE'|undefined;

export class InflectionSubType {
  id: string = "";
  name: string = "";
  description: string = "";
}

export class InflectionResponse {
  inflectionSubType: InflectionSubType = new InflectionSubType();
  inflectionValues: any;
}
