import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationEditComponent } from './location-edit/location-edit.component';
import { LocationListComponent } from './location-list/location-list.component';


const routes: Routes = [
  { path: ':id', component: LocationEditComponent },
  { path: '', component: LocationListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
