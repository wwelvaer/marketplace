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
  id: number,
  firstName: string,
  lastName: string,
  accesToken: string
}
