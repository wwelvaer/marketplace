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
    // redirect to login page when not logged in
    if (!this.user.isLoggedIn())
        this.router.navigateByUrl("/login")
    // initialize form fields
    this.form = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      availableAssets: new FormControl(),
      startDate: new FormControl(),
      price: new FormControl(),
    })
   }

  ngOnInit(): void {
    // get url query params
    this.route.queryParamMap.subscribe(qMap => {
      // when query has 'edit' parameter, edit listing data
      let lId = qMap['params'].edit;
      if (lId){
        this.db.getListing(lId).then(l => {
          if (this.user.getId() === l['userID']){
            // update listingID
            this.listingId = l['listingID']
            // fill out form with listingdata
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

  // onSubmit function
  createListing(){
    // create listing
    if (this.listingId < 0)
      this.db.createListing(this.user.getLoginToken(), this.form.getRawValue()).then(r => {
        // go to details page
        this.router.navigateByUrl(`/listings/details/${r['listingID']}`)
      })
    else // update listing
      this.db.postListing(this.listingId, this.user.getLoginToken(), this.form.getRawValue()).then(r => {
        // go to details page
        this.router.navigateByUrl(`/listings/details/${this.listingId}`)
      })
  }
}
