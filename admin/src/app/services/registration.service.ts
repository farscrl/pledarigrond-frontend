import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LanguageSelectionService } from './language-selection.service';
import { Language } from '../models/security';
import { ListFilter } from '../models/registration-filter';
import { Registration } from '../models/registration';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private registrationsBasePath = '/editor/registrations';

  private idiom: Language = Language.RUMANTSCHGRISCHUN;

  constructor(private httpClient: HttpClient, private languageSelectionService: LanguageSelectionService) {
    this.languageSelectionService.getCurrentLanguageObservable().subscribe(idiom => {
      this.idiom = idiom;
    });
  }

  getRegistrations(filter: ListFilter, page: number = 0, pageSize = 15) {
    let params: HttpParams = new HttpParams().set('ascending', filter.ascending ? 'true' : 'false');
    if (filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }
    if (filter.status) {
      params = params.set('status', filter.status);
    }
    if (page > 0) {
      params = params.set('page', page.toString());
    }
    if (pageSize > 0) {
      params = params.set('pageSize', pageSize.toString());
    }
    return this.httpClient.get<Page<Registration>>(this.generateUrl('/list'), { params });
  }

  getNextRegistration() {
    return this.httpClient.get<Registration>(this.generateUrl('/next'));
  }

  postponeRegistration(registration: Registration) {
    return this.httpClient.post<Registration>(this.generateUrl('/postpone'), registration);
  }

  acceptRegistration(registration: Registration) {
    return this.httpClient.post<Registration>(this.generateUrl('/accept'), registration);
  }

  rejectRegistration(registration: Registration) {
    return this.httpClient.post<Registration>(this.generateUrl('/reject'), registration);
  }

  postponeReviewRegistration(registration: Registration) {
    return this.httpClient.post<Registration>(this.generateUrl('/postpone_review'), registration);
  }

  addRegistrationToLemma(registration: Registration, lexEntryId: string) {
    return this.httpClient.post<Registration>(this.generateUrl('/add_to_lemma/' + lexEntryId), registration);
  }

  didOrderRegistration(lexEntryId: string) {
    return this.httpClient.post<boolean>(this.generateUrl('/did_order/' + lexEntryId), null);
  }

  orderRegistration(registration: Registration) {
    return this.httpClient.post<Registration>(this.generateUrl('/order'), registration);
  }

  uploadFile(file: Blob, registration: Registration) {
    const formData: FormData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(registration)], { type: 'application/json' });
    formData.append('registration', jsonBlob);

    formData.append('file', file);

    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });

    return this.httpClient.post<Registration>(this.generateUrl('/upload'), formData, { headers });
  }

  getMp3Url(registration: Registration) {
    return `https://pg-data.b-cdn.net/pronunciation/${environment.envName}/${registration.id}/${registration.id}.mp3?lastModifiedDate=${registration.lastModifiedDate}`;
  }

  private generateUrl(segment: string) {
    return environment.apiUrl + "/" + this.idiom + this.registrationsBasePath + segment;
  }
}
