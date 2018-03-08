import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CreatorFormComponent} from './asset-builder/creator-form/creator-form.component';
import {MarketplaceListingComponent} from './marketplace-listing/marketplace-listing.component';
import {AssetComponent} from './asset/asset.component';
import {MyAssetsComponent} from './my-assets/my-assets.component';

const routes: Routes = [
  {path: 'create', component: CreatorFormComponent},
  {path: 'marketplace', component: MarketplaceListingComponent},
  {path: 'asset', component: AssetComponent},
  {path: 'my-assets', component: MyAssetsComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
