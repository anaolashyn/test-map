import './polyfills';

import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from './material-module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {TreeFlat} from './app/tree-flat';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    LeafletModule.forRoot(),
  ],
  entryComponents: [TreeFlat],
  declarations: [TreeFlat],
  bootstrap: [TreeFlat],
  providers: []
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
