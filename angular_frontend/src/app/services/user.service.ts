import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User

  constructor() { }

  isLoggedIn(): boolean{
    return typeof this.user !== "undefined";
  }

  setUser(user: User): void{
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
  firstName: string,
  lastName: string,
  email: string
}
