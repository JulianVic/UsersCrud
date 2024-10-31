//login.component.ts
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  userService = inject(AuthService)
  router = inject(Router)

  constructor() {
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  async onSubmit(){
    const res = await this.userService.auth(this.form.value)
    sessionStorage.setItem("access_token", res.access_token)
    this.router.navigate(['/dashboard'])
  }
}
