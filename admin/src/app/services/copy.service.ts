import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  private lexEntryIdValue: string | undefined;
  private infinitive: string | undefined;

  constructor() { }

  copyConjugation(lexEntryId: string, infinitive: string) {
    if (!lexEntryId || !infinitive) {
      return;
    }
    this.lexEntryIdValue = lexEntryId;
    this.infinitive = infinitive;
  }

  canPasteConjugation(): boolean {
    return this.lexEntryIdValue !== undefined;
  }

  get conjugationInfinitive(): string {
    return this.infinitive!;
  }

  get lexEntryId(): string | undefined {
    return this.lexEntryIdValue;
  }
}
