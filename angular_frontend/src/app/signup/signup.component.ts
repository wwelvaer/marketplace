import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  error: string= ""

  constructor(private db: DbConnectionService,
    private user: UserService,
    private route: Router) {
    this.form = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      gender: new FormControl(),
      address: new FormControl(),
      birthDate: new FormControl(),
      phoneNumber: new FormControl(),
      password: new FormControl(),
      repeatPassword: new FormControl()
    });
   }

  ngOnInit(): void {
  }

  passwordStrength(password: string): number{
    return [
      password.split("").reduce((t, x) => t || isNaN(+x) && x === x.toUpperCase(), false), // contains uppercase letter
      password.split("").reduce((t, x) => t || !isNaN(+x), false), // contains number
      password.length >= 8, // long enough
    ].reduce((acc, x) => x ? acc + 1 : acc, 1)
  }

  signUp(){
    let v = this.form.getRawValue();
    delete v.repeatPassword;
    this.db.signUp(v)
      .then(_ => {
        this.route.navigateByUrl('/login')
      })
      .catch(r => this.error = r.error.message);
  }
}
