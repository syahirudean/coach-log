import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOrganizationComponent } from './add-organization/add-organization.component';
import { AddSessionComponent } from './add-session/add-session.component';
import { OrganizationComponent } from './organization.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationComponent,
  },
  {
    path: 'add-session',
    component: AddSessionComponent,
  },
  {
    path: 'add-client',
    component: AddOrganizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
