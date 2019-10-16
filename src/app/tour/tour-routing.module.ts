import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TourListComponent } from './tour-list/tour-list.component';

const routes: Routes = [
  { path: '', component: TourListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourRoutingModule { }
