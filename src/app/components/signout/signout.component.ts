import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    localStorage.removeItem('token_transfer');
    localStorage.removeItem('username');
    localStorage.removeItem('fname');
    localStorage.removeItem('lname');
    this.router.navigate(['/signin']);
  }

}
