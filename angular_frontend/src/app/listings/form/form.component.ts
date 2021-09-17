import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  listingId: number = -1;

  constructor(private user: UserService,
    private route: ActivatedRoute,
    private db: DbConnectionService,
    private router: Router) {
    if (!this.user.isLoggedIn())
        this.router.navigateByUrl("/login")
    this.form = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      availableAssets: new FormControl(),
      startDate: new FormControl(),
      price: new FormControl(),
    })
   }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(qMap => {
      let lId = qMap['params'].edit;
      if (lId){
        this.db.getListing(lId).then(l => {
          if (this.user.getId() === l['userID']){
            this.listingId = l['listingID']
            this.form.patchValue({
              name: l['name'],
              description: l['description'],
              availableAssets: l['availableAssets'],
              startDate: l['startDate'],
              price: l['price'],
            })
          }
        })
      }
    })
  }

  createListing(){
    if (this.listingId < 0)
      this.db.createListing(this.user.getLoginToken(), this.form.getRawValue()).then(r => {
        this.router.navigateByUrl(`/listings/details/${r['listingID']}`)
      })
    else
      this.db.postListing(this.listingId, this.user.getLoginToken(), this.form.getRawValue()).then(r => {
        this.router.navigateByUrl(`/listings/details/${this.listingId}`)
      })
  }
}
