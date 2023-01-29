import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }
  public showButton: boolean = false;
  public token_transfer: any;

  ngOnInit(): any {
    this.token_transfer = localStorage.getItem('token_transfer');
    if (this.token_transfer !== null)
      this.showButton = true;
  }

}
