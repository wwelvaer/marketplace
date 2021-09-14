import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  backendPort = 3000;
  url = 'http://localhost:' + this.backendPort;

  constructor(private http: HttpClient) {
  }

  getTokenHeader(token: string){
    return new HttpHeaders().set('x-access-token', token);
  }

  signIn(email: string, password: string){
    return this.http.post(`${this.url}/api/auth/signin`, {'email': email, 'password': password}).toPromise();
  }

  signUp(fields: Object){
    return this.http.post(`${this.url}/api/auth/signup`, fields).toPromise();
  }

  getUserData(id: number, userToken: string){
    return this.http.get(`${this.url}/api/userdata?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  postUserData(id: number, userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/userdata?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }
}
