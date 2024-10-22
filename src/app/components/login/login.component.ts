//login.component.ts
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  userService = inject(UserService)
  router = inject(Router)

  constructor() {
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  async onSubmit(){
    const res = await this.userService.login(this.form.value)
    sessionStorage.setItem("access_token", res.access_token)
    this.router.navigate(['/dashboard'])
  }
}
