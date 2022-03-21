import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LanguageSelectionComponent } from './components/language-selection/language-selection.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './features/search/search.component';
import { GridWrapperComponent } from './features/search/grid-wrapper/grid-wrapper.component';
import { HelpComponent } from './features/help/help.component';
import { InfoComponent } from './features/info/info.component';
import { SearchContentComponent } from './features/search/search-content/search-content.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LanguageSelectionComponent,
    MainComponent,
    FooterComponent,
    SearchComponent,
    GridWrapperComponent,
    HelpComponent,
    InfoComponent,
    SearchContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
