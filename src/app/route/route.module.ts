import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

import { RouteRoutingModule } from './route-routing.module';
import { RouteListComponent } from './route-list/route-list.component';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { RouteEditComponent } from './route-edit/route-edit.component';

@NgModule({
  declarations: [RouteListComponent, RouteEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouteRoutingModule,
    CdkTableModule,
    AppMaterialModule
  ]
})
export class RouteModule {}
