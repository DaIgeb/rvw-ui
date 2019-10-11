import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { navigationReducer } from './navigation.reducer';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialModule,
    StoreModule.forFeature('navigation', navigationReducer)
  ],
  exports: [
    NavigationComponent
  ]
})
export class NavigationModule { }
