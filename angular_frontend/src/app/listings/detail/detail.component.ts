import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common'
import { FormControl, FormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  listing: object;
  error: string;
  form:FormGroup;
  transactions = [];

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private location: Location,
    private router: Router,
    public image: ImageService) {
      // initialize form field
      this.form = new FormGroup({
        numberOfAssets: new FormControl()
      })
    }

  ngOnInit(): void {
    // get url query params
    this.route.params.subscribe(params => {
      // get listingdata
      this.db.getListing(params.id)
        .then(l => {
          this.db.getCategories().then(c => {
            let categories = []
            Object.entries(c).forEach(([k, v]) => {
              let v2 = v.filter(x => l["categories"].includes(x));
              if (v2.length > 0)
                categories.push([k, v2])
            })
            this.listing = l
            this.listing['categories'] = categories;
            // if listing if made by logged in user show transactions
            if (this.listing['userID'] === this.user.getId())
              this.loadTransactions();
          })

        })
        .catch(err => this.error = err.error.message)
    })
  }

  // get transactions
  loadTransactions(){
    this.db.getListingTransactions(this.listing['listingID'], this.user.getLoginToken())
              .then(b => this.transactions = b['transactions'])
              .catch(err => this.error = err.error.message)
  }

  // delete listing
  deleteListing(id: number){
    this.db.deleteListing(id, this.user.getLoginToken()).then(_ => {
      this.location.back() // go back
    })
  }

  // create transaction
  createTransaction(){
    // get form value
    let v = this.form.getRawValue()
    // add listingID to form values
    v['listingID'] = this.listing['listingID'];
    this.db.createTransaction(this.user.getLoginToken(), v).then(_ => {
      // go to transactions
      this.router.navigate(['/listings'], {queryParams: { transactions: true }})
    })
  }

  // cancel transaction
  cancelTransaction(transactionId: number){
    this.db.cancelTransaction(transactionId, this.user.getLoginToken()).then(r => {
      // update transaction data
      this.loadTransactions();
    }).catch(r => this.error = r.error.message)
  }

  // confirm transaction payment
  confirmPayment(transactionId: number){
    this.db.confirmPayment(transactionId, this.user.getLoginToken()).then(r => {
      // update transaction data
      this.loadTransactions();
    }).catch(r => this.error = r.error.message)
  }
}
