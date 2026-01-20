import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeedEntry } from 'src/app/models/feed';
import { FeedService } from 'src/app/services/feed.service';
import { FrontendLanguage, SelectedLanguageService } from 'src/app/services/selected-language.service';
import { SlicePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-rss-feed',
    templateUrl: './rss-feed.component.html',
    styleUrls: ['./rss-feed.component.scss'],
    imports: [SlicePipe, TranslatePipe]
})
export class RssFeedComponent implements OnInit, OnDestroy {
  private feedService = inject(FeedService);
  private selectedLanguageService = inject(SelectedLanguageService);


  private language: FrontendLanguage = 'rm';
  private frontendLanguageSubscription?: Subscription;
  private interval?: any;

  feedEntries: FeedEntry[] = [];
  visibleFeedIndex = 0;

  ngOnInit(): void {
    this.selectedLanguageService.getFrontendLanguageObservable().subscribe(value => {
      this.language = value;
      this.loadRssFeedEntries();
    });

    const that = this;
    this.interval = setInterval(() => {this.changeElementVisibility();}, 5000);
  }

  ngOnDestroy(): void {
      if (this.frontendLanguageSubscription) {
        this.frontendLanguageSubscription.unsubscribe();
      }
      if (this.interval) {
        clearInterval(this.interval);
      }
  }

  loadRssFeedEntries() {
    this.feedService.getFeed(this.language).subscribe(values => {
      this.feedEntries = values;
    });
  }

  changeElementVisibility() {
    if (this.feedEntries.length > (this.visibleFeedIndex + 1)) {
      this.visibleFeedIndex++;
      return;
    }
    this.visibleFeedIndex = 0;
  }
}
