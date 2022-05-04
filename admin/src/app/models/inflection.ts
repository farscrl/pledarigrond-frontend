export type InflectionType = 'VERB'|'NOUN'|undefined;

export class InflectionSubType {
  id: string = "";
  name: string = "";
  description: string = "";
}

export class InflectionResponse {
  inflectionSubType: InflectionSubType = new InflectionSubType();
  inflectionValues: any;
}
