import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  backendPort = 3000;
  url = 'http://localhost:' + this.backendPort;

  constructor(private http: HttpClient) {
  }

  signIn(email: string, password: string){
    return this.http.post(`${this.url}/api/auth/signin`, {'email': email, 'password': password}).toPromise();
  }

  signUp(fields: Object){
    return this.http.post(`${this.url}/api/auth/signup`, fields).toPromise();
  }
}
