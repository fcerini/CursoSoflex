import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'curso-soflex';
  isLogged!: boolean;

  constructor(private authService:AuthService,
              private router: Router){}

  ngOnInit(){
    if(!this.authService.isLogged()){
      this.isLogged = false;
    }else{
      this.isLogged = true;
    }
  }

  logout(){
    this.authService.logout();
    this.isLogged = false;
    this.router.navigateByUrl('/');
  }

  handleLogin(log: boolean){
    this.isLogged = log;
  }
}
