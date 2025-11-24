import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor() { }

  getMp3UrlById(pronunciation: string) {
    const parts = pronunciation.split('/');
    if (parts.length < 2) {
      throw new Error('pronunciation does not contain a slash or does not have two parts');
    }
    const env = parts[0];
    const id = parts[1];

    return `https://pg-data.b-cdn.net/pronunciation/${env}/${id}/${id}.mp3`;
  }
}
