import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() isLogged = new EventEmitter<boolean>();
  errorLogin = false;

  form!: FormGroup;

  constructor(private fb:FormBuilder, 
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      user: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  login() {
    const val = this.form.value;
    this.errorLogin = false;

    if (val.user && val.password) {
      this.authService.login(val.user, val.password).subscribe((authResult: any) => {
        if(authResult.id > 0){
            localStorage.setItem('Authorization', JSON.stringify(authResult));
            this.isLogged.emit(true)
            this.router.navigateByUrl('/');
        }else{
          this.errorLogin = true;
        }
      })
    }
  }
}
