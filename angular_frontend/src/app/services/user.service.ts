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

  getUserName(): string {
    return this.user ? this.user.userName : ""
  }

  // calculates password strength [1-4]
  passwordStrength(password: string): number{
    return [
      password.split("").reduce((t, x) => t || isNaN(+x) && x === x.toUpperCase(), false), // contains uppercase letter
      password.split("").reduce((t, x) => t || !isNaN(+x), false), // contains number
      password.length >= 8, // long enough
    ].reduce((acc, x) => x ? acc + 1 : acc, 1)
  }
}

// locally stored userdata
export interface User {
  id: number,
  userName: string,
  accessToken: string
}
