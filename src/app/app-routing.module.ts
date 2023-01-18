import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { TachesComponent } from './component/taches/taches.component';
import { IsSignedInGuard } from './is-signed-in.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent 
  },
  {
    path: 'taches',
    component: TachesComponent,
    canActivate: [IsSignedInGuard]
  },
  {
    path: 'signup',
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
