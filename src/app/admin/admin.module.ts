import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AppMaterialModule } from '../app-material/app-material.module';
import { RoleModule } from './role/role.module';
import { CoreModule } from '@app/core';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
    CoreModule,
    RoleModule
  ]
})
export class AdminModule { }
