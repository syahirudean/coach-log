import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';
import { map } from 'rxjs';

const redirectToProfileEditOrLogin = () =>
  map((user: any) => {
    if (user) {
      return `${user.uid}`;
    }
    return true;
  });

const onlyAllowSelf = (next: any) =>
  map((user: any) => {
    if (!!user && next.params.userId === user.uid) {
      return true;
    } else {
      return '/';
    }
  });

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    ...canActivate(redirectToProfileEditOrLogin),
  },
  {
    path: ':userId',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    ...canActivate(onlyAllowSelf),
  },
  {
    path: ':userId/:id',
    loadChildren: () =>
      import('./organization/organization.module').then(
        (m) => m.OrganizationModule
      ),
    ...canActivate(onlyAllowSelf),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
