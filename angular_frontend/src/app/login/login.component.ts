import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  error: string = ""

  constructor(private db: DbConnectionService,
    private user: UserService,
    private route: Router) {
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  logIn(){
    let d = this.form.getRawValue();
    this.db.signIn(d.email, d.password)
      .then((r: User) => {
        this.user.setUser(r)
        this.route.navigateByUrl('/home')
      })
      .catch(r => this.error = r.error.message);
  }

}
