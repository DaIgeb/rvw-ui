import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CallbackComponent } from './callback/callback.component';
import { EditProfileComponent } from './core/current-user/edit-profile/edit-profile.component';

const routes: Routes = [
  { path: 'callback', component: CallbackComponent },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  {
    path: 'current-user',
    children: [
      { path: 'profile', component: EditProfileComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
