import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User

  constructor(private cookieService: CookieService) {
    let u = this.cookieService.get('user');
    if (u)
      this.user = JSON.parse(u);
    console.log(u)
  }

  isLoggedIn(): boolean{
    return typeof this.user !== "undefined";
  }

  setUser(user: User): void{
    this.cookieService.set('user', JSON.stringify(user), 1);
    this.user = user;
  }

  getUser(): User | undefined{
    return this.user;
  }

  logOut(): void{
    this.user = undefined;
  }
}

export interface User {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  accesToken: string
}
