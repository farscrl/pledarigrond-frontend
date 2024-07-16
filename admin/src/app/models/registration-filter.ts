import { RegistrationStatus } from './registration';

export class ListFilter {
  searchTerm?: string;
  status?: RegistrationStatus;
  ascending?: boolean;
}
