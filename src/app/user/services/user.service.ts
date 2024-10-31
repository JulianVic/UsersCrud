//user.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { UpdateUser } from '../interfaces/UpdateUser';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CreateUser } from '../interfaces/CreateUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl : string
  constructor() {
    this.baseUrl = 'http://localhost:3000/api/user';
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  getUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl, this.getAuthHeaders());
  }

  createUser(user: CreateUser): Observable<any> {
    return this.httpClient.post(this.baseUrl, user, this.getAuthHeaders());
  }

  updateUser(user: UpdateUser): Observable<any> {
    return this.httpClient.patch(`${this.baseUrl}/${user.id}`, user, this.getAuthHeaders());
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${userId}`, this.getAuthHeaders());
  }
  
}
