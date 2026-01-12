import { InflectionType, PublicationStatus } from './dictionary';
import { SearchDirection, SearchMethod } from './lucene-search-criteria';

export class DbSearchCriteria {
  searchPhrase?: string;
  searchDirection?: SearchDirection;
  searchMethod?: SearchMethod;
  state?: PublicationStatus;
  inflectionType?: InflectionType;
  showReviewLater?: boolean;

  userOrIp?: string;
  role?: string;
  startTime?: number;
  endTime?: number;

  // only set to fix linting error in template. fields can't be used.
  highlight = false;
}
