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

  deleteRegistration(registration: Registration) {
    return this.httpClient.delete<Registration>(this.generateUrl('', registration.id));
  }

  addRegistrationToLemma(registration: Registration, entryId: string) {
    return this.httpClient.post<Registration>(this.generateUrl('/add_to_lemma/' + entryId), registration);
  }

  removeRegistrationFromLemma(entryId: string) {
    return this.httpClient.post<Registration>(this.generateUrl('/remove_from_lemma/' + entryId), {});
  }

  didOrderRegistration(entryId: string) {
    return this.httpClient.post<Registration | null>(this.generateUrl('/did_order/' + entryId), null);
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

  getMp3UrlByRegistration(registration: Registration) {
    return `https://pg-data.b-cdn.net/pronunciation/${environment.envName}/${registration.id}/${registration.id}.mp3?lastModifiedDate=${registration.lastModifiedDate}`;
  }

  getMp3UrlById(pronunciation: string) {
    const parts = pronunciation.split('/');
    if (parts.length < 2) {
      throw new Error('pronunciation does not contain a slash or does not have two parts');
    }
    const env = parts[0];
    const id = parts[1];

    return `https://pg-data.b-cdn.net/pronunciation/${env}/${id}/${id}.mp3`;
  }

  private generateUrl(segment: string, id?: string) {

    let base = environment.apiUrl + "/" + this.idiom + this.registrationsBasePath;
    if (id) {
      base += "/" + id;
    }
    return base + segment;
  }
}
