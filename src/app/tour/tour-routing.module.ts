import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TourListComponent } from './tour-list/tour-list.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';
import { TourHomeComponent } from './tour-home/tour-home.component';

const routes: Routes = [
  { path: 'list', component: TourListComponent },
  { path: ':id', component: TourEditComponent },
  { path: '', component: TourHomeComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourRoutingModule {}
