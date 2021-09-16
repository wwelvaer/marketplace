import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  form: FormGroup;
  error: string

  constructor(private user: UserService,
    private route: Router,
    private db: DbConnectionService,
    private router: Router) {
    if (!this.user.isLoggedIn())
        this.route.navigateByUrl("/login")
    this.form = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      availableAssets: new FormControl(),
      startDate: new FormControl(),
      price: new FormControl(),
    })
   }

  ngOnInit(): void {
  }

  createListing(){
    this.db.createListing(this.user.getLoginToken(), this.form.getRawValue()).then(r => {
      this.router.navigateByUrl(`/listings/details/${r['listingID']}`)
    })
  }
}
