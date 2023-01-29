import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { DataTablesModule } from "angular-datatables";
import { AuthGuardService } from './services/auth-guard.service';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StaffComponent } from './components/staff/staff.component';
import { SigninComponent } from './components/signin/signin.component';
import { DateThaiPipe } from './pipes/date-thai.pipe';
import { ReportComponent } from './components/report/report.component';
import { SendBillComponent } from './components/send-bill/send-bill.component';
import { BillMemberPipe } from './pipes/bill-member.pipe';
import { SignoutComponent } from './components/signout/signout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    StaffComponent,
    SigninComponent,
    DateThaiPipe,
    ReportComponent,
    SendBillComponent,
    BillMemberPipe,
    SignoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
