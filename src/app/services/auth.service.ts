import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { VerifyService } from '../services/verify.service';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public token: any;
  public fname: any;
  public value: boolean = false;
  public results: any;
  public status = true

  constructor(
    public jwtHelper: JwtHelperService,
    // public verifyService: VerifyService
  ) { }

  public isAuthenticated(): boolean {
    this.token = localStorage.getItem('token_transfer');
    this.fname = localStorage.getItem('fname');
    this.fname = localStorage.getItem('lname');
    let expired = !this.jwtHelper.isTokenExpired(this.token);
    this.results = this.jwtHelper.decodeToken(this.token);
    // ต้องมี token และต้องมี status เป็น 1 หรือ 0 ถึงจะสามารถเข้าระบบได้ 
    // ถ้าลบ token ออกก็ไม่สามารถเข้าระบบได้
    try {
      if (expired) {
        this.value = true;
      } else {
        this.value = false;
      }
    } catch (error) {
      this.value = false;
    }
    return this.value;
  }
}

