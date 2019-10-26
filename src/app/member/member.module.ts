import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { MemberListComponent } from './member-list/member-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [MemberListComponent, MemberEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MemberRoutingModule,
    CdkTableModule,
    SharedModule,
    AppMaterialModule
  ]
})
export class MemberModule { }
