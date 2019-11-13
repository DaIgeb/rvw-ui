import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

import { RouteRoutingModule } from './route-routing.module';
import { RouteListComponent } from './route-list/route-list.component';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { RouteEditComponent } from './route-edit/route-edit.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [RouteListComponent, RouteEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouteRoutingModule,
    CdkTableModule,
    SharedModule,
    AppMaterialModule
  ]
})
export class RouteModule {}
