import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

import { HomeComponent } from './components/home/home.component'
import { StaffComponent } from './components/staff/staff.component'
import { ReportComponent } from './components/report/report.component';
import { SendBillComponent } from './components/send-bill/send-bill.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignoutComponent } from './components/signout/signout.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signout', component: SignoutComponent },
  { path: 'home', component: SendBillComponent },
  { path: 'home1', component: HomeComponent },
  { path: 'staff', canActivate: [AuthGuard], component: StaffComponent },
  { path: 'report', canActivate: [AuthGuard], component: ReportComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
