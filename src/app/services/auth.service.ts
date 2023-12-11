import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:3000';

  registerUser(userDetails:User){
    return this.http.post(`${this.baseUrl}/users`,userDetails);
  }

  getUserByEmail(email:string):Observable<User[]>{
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }
}
