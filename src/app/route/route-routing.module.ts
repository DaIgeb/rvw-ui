import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteListComponent } from './route-list/route-list.component';
import { RouteEditComponent } from './route-edit/route-edit.component';

const routes: Routes = [
  { path: ':id', component: RouteEditComponent },
  { path: '', component: RouteListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule {}
