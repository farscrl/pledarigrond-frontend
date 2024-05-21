export class Registration {

  id?: string;
  status: RegistrationStatus = 'TODO';
  deStichwort?: string;
  rmStichwort?: string;
  rmSemantik?: string;
  rmSubsemantik?: string;
  rmGrammatik?: string;
  rmGenus?: string;
  rmFlex?: string;
  rmTags?: string;
  rmInflectionType?: string;
  rmInflectionSubtype?: string;

  speakerComment?: string;
  reviewerComment?: string;

  lemmaIds?: string[];

  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export type RegistrationStatus = 'TODO' | 'POSTPONED_REGISTRATION' | 'IN_REVIEW' | 'POSTPONED_REVIEW' | 'COMPLETED' | 'REFUSED';
