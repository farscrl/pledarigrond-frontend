export class Name {
  id?: string;
  nameRumantschGrischun?: string;
  nameGerman?: string;
  category: NameCategory = "OTHER";
  nameSursilvan?: string;
  nameSutsilvan?: string;
  nameSurmiran?: string;
  namePuter?: string;
  nameVallader?: string;
}

export type NameCategory = 'GEOGRAPHY'|'FIRSTNAME'|'SURNAME'|'COMPANY'|'ABBREVIATION'|'OTHER';
