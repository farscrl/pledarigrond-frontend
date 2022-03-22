import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedLanguageService {

  constructor() { }

  getSelectedLanguageUrlSegment(): string {
    return "surmiran";
  }
}
