import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  error: string;
  form: FormGroup

  constructor(public user: UserService,
    private route: Router,
    private db: DbConnectionService) {
      if (!user.isLoggedIn())
        this.route.navigateByUrl("/login")
      this.form = new FormGroup({
        firstName: new FormControl(),
        lastName: new FormControl(),
        email: new FormControl(),
        gender: new FormControl(),
        address: new FormControl(),
        birthDate: new FormControl(),
        phoneNumber: new FormControl(),
      });
    }

  ngOnInit(): void {
    let u = this.user.getUser();
    this.db.getUserData(u.id, u.accessToken)
      .then(user => {
        Object.keys(user).forEach(x => {
          this.form.get(x).setValue(user[x])
        })
      })
      .catch(r => this.error = r.error.message);
  }

  updateProfile(){
    let u = this.user.getUser(),
        v = this.form.getRawValue()
    this.db.postUserData(u.id, u.accessToken, v)
    .then(_ =>{
      this.user.setUser({
        id: u.id,
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        accessToken: u.accessToken
      })
      this.route.navigateByUrl("/home")
    } )
    .catch(err => this.error = err.error.message)
  }

}
