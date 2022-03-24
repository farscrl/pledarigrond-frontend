export class Page<T> {
  content: T[] = [];
  pageable: any;
  last: boolean = true;
  totalPages: number = 0;
  totalElements: number = 0;
  first: boolean = true;
  size: number = 1;
  number: number = 1;
  sort: any;
  numberOfElements: number = 0;
  empty: boolean = true;
}
