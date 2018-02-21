import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreatorFormComponent } from './asset-builder/creator-form/creator-form.component';

const routes: Routes = [
  { path: '', component: CreatorFormComponent }
  //{ path: 'create', component: CreatorFormComponent },
  //{ path: '', redirectTo: '/create', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
