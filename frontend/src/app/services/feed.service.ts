import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedEntry } from '../models/feed';
import { environment } from './../../environments/environment';
import { FrontendLanguage } from './selected-language.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private httpClient = inject(HttpClient);


  getFeed(language: FrontendLanguage): Observable<FeedEntry[]> {
    return this.httpClient.get<Array<any>>(this.getFeedUrl())
      .pipe(
        map(value => {
          const returnValues: FeedEntry[] = [];

          (value as Array<any>).forEach(element => {
            const feedElements = JSON.parse(element) as Array<any>;
            feedElements.forEach(entry => {
              if (entry.Language === language) {
                const el = new FeedEntry();
                el.text = this.removeHtml(entry.Text);
                el.title = this.removeHtml(entry.Name);
                el.url = entry.Url;
                returnValues.push(el);
              }
            });
          });
          return returnValues;
        })
      )
  }

  private getFeedUrl(): string {
    return environment.apiUrl + "/user/feed";
  }

  private removeHtml(text: string) {
    return text.replace(/<[^>]*>/g, '');
  }
}
