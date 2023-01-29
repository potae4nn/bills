import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private userService: UsersService, private route: Router,) { }

  public formSignin = {
    username: '',
    password: ''
  }

  ngOnInit(): void {
  }

  onSubmit() {
    // console.log(this.formSignin);
    this.userService.signin(this.formSignin).subscribe(res => {
      // console.log(res);
      if (res === null) return alert('รหัสผ่านไม่ถูกต้อง');
      if (res.code === 401) return alert('ไม่มีชื่อผู้ใช้');
      if (res !== null) {
        localStorage.setItem('token_transfer', res.token);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem("fname", res.data.fname);
        localStorage.setItem("lname", res.data.lname);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          this.route.navigate(['/staff']);
        }
        );
      }
    })
  }

}
