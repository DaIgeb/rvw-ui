import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeasonComponent } from './season/season.component';
import { SeasonEditComponent } from './season-edit/season-edit.component';


const routes: Routes = [
  { path: '', component: SeasonComponent },
  { path: ':id', component: SeasonEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourPlanerRoutingModule { }
