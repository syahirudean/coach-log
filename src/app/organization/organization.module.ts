import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './organization.component';
import { AddSessionComponent } from './add-session/add-session.component';
import { SharedModule } from '../shared/shared.module';
import { AddOrganizationComponent } from './add-organization/add-organization.component';

@NgModule({
  declarations: [
    OrganizationComponent,
    AddSessionComponent,
    AddOrganizationComponent,
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OrganizationModule {}
