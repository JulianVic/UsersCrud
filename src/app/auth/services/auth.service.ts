//auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:3000/api/auth';
  }

  auth(formValue: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}`, formValue)
    )
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }
}
