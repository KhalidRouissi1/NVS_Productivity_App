import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent  {

  constructor(private router:Router){}
  userOut(): boolean {
    return localStorage.getItem("email") === null;
  }

  logout() {
    localStorage.removeItem("email");
    this.router.navigate(['/']);

  }
}
