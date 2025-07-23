import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  private entryIdValue: string | undefined;
  private infinitive: string | undefined;

  constructor() { }

  copyConjugation(entryId: string, infinitive: string) {
    if (!entryId || !infinitive) {
      return;
    }
    this.entryIdValue = entryId;
    this.infinitive = infinitive;
  }

  canPasteConjugation(): boolean {
    return this.entryIdValue !== undefined;
  }

  get conjugationInfinitive(): string {
    return this.infinitive!;
  }

  get entryId(): string | undefined {
    return this.entryIdValue;
  }
}
