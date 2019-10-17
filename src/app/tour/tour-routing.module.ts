import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TourListComponent } from './tour-list/tour-list.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'tour/:id', component: TourEditComponent },
  { path: 'list', component: TourListComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourRoutingModule { }
