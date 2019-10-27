import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CallbackComponent } from './callback/callback.component';
import { EditProfileComponent } from './core/current-user/edit-profile/edit-profile.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'callback', component: CallbackComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'route', loadChildren: () => import('./route/route.module').then(m => m.RouteModule) },
  { path: 'member', loadChildren: () => import('./member/member.module').then(m => m.MemberModule) },
  { path: 'tour', loadChildren: () => import('./tour/tour.module').then(m => m.TourModule) },
  { path: 'location', loadChildren: () => import('./location/location.module').then(m => m.LocationModule) },
  {
    path: 'current-user',
    children: [
      { path: 'profile', component: EditProfileComponent }
    ]
  },
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
