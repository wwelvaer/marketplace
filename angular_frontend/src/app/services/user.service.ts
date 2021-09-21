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
    // search for user in cookies
    let u = this.cookieService.get(this.cookieName);
    if (u)
      this.user = JSON.parse(u);
  }

  isLoggedIn(): boolean{
    return typeof this.user !== "undefined";
  }

  setUser(user: User): void{
    // store user in cookies
    if (this.storeCookie)
      this.cookieService.set(this.cookieName, JSON.stringify(user), 1);
    this.user = user;
  }

  getUser(): User | undefined{
    return this.user;
  }

  logOut(): void{
    // delete user cookie
    this.cookieService.delete(this.cookieName)
    this.user = undefined;
  }

  getLoginToken(): string {
    return this.user ? this.user.accessToken : ""
  }

  getId(): number {
    return this.user ? this.user.id : -1
  }
}

// locally stored userdata
export interface User {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  accessToken: string
}
