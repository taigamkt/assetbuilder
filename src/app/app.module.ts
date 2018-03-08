import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {CreatorFormComponent} from './asset-builder/creator-form/creator-form.component';
import {HeaderComponent} from './header/header.component';
import {UtilModule} from './util/util.module';
import {AppRoutingModule} from './app-routing.module';
import {MarketplaceListingComponent} from './marketplace-listing/marketplace-listing.component';
import {AssetComponent} from './asset/asset.component';
import {MyAssetsComponent} from './my-assets/my-assets.component';

@NgModule({
  declarations: [
    AppComponent,
    CreatorFormComponent,
    HeaderComponent,
    MarketplaceListingComponent,
    AssetComponent,
    MyAssetsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    UtilModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
