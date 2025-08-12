import { EntryInfos, EntryVersionInternalDto, NormalizedEntryVersionDto, PublicationStatus } from './dictionary';
import { Page } from './page';

export class DictionaryListItem implements EntryInfos {
  entryId!: string;
  publicationStatus!: PublicationStatus;

  version!: EntryVersionInternalDto;

  // for UI state
  disabled: boolean = false;
  selected: boolean = false;
}

export class AutoReviewListItem {
  entryId!: string;
  version!: NormalizedEntryVersionDto;

  selected: boolean = false;
  local_review_status: 'ACCEPTED'|'REJECTED'|'EDITED'|'LATER'|'UNDEFINED' = 'UNDEFINED';
}

export class PaginationInfo {
  totalElements: number = 0;
  size: number = 1;
  number: number = 0;

  constructor(page?: Page<any>) {
    if (page) {
      this.totalElements = page.totalElements;
      this.size = page.size;
      this.number = page.number;
    }
  }
}
