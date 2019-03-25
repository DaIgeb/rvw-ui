import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  { path: 'callback', component: CallbackComponent },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
