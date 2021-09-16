import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  cookieName: string = 'user'
  user: User
  public storeCookie: boolean = false;

  constructor(private cookieService: CookieService) {
    let u = this.cookieService.get(this.cookieName);
    if (u)
      this.user = JSON.parse(u);
  }

  isLoggedIn(): boolean{
    return typeof this.user !== "undefined";
  }

  setUser(user: User): void{
    if (this.storeCookie)
      this.cookieService.set(this.cookieName, JSON.stringify(user), 1);
    this.user = user;
  }

  getUser(): User | undefined{
    return this.user;
  }

  logOut(): void{
    this.cookieService.delete(this.cookieName)
    this.user = undefined;
  }

  getLoginToken(): string {
    return this.user ? this.user.accessToken : ""
  }
}

export interface User {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  accessToken: string
}
