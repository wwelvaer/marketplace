import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common'
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  listing: object;
  error: string;
  form:FormGroup;
  bookings = [];

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private location: Location,
    private router: Router) {
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
          this.listing = l
          // if listing if made by logged in user show bookings
          if (this.listing['userID'] === this.user.getId())
            this.loadBookings();
        })
        .catch(err => this.error = err.error.message)
    })
  }

  // get bookings
  loadBookings(){
    this.db.getListingBookings(this.listing['listingID'], this.user.getLoginToken())
              .then(b => this.bookings = b['bookings'])
              .catch(err => this.error = err.error.message)
  }

  // delete listing
  deleteListing(id: number){
    this.db.deleteListing(id, this.user.getLoginToken()).then(_ => {
      this.location.back() // go back
    })
  }

  // create booking
  createBooking(){
    // get form value
    let v = this.form.getRawValue()
    // add listingID to form values
    v['listingID'] = this.listing['listingID'];
    this.db.createBooking(this.user.getLoginToken(), v).then(_ => {
      // go to bookings
      this.router.navigate(['/listings'], {queryParams: { bookings: true }})
    })
  }

  // cancel booking
  cancelBooking(bookingId: number){
    this.db.cancelBooking(bookingId, this.user.getLoginToken()).then(r => {
      // update booking data
      this.loadBookings();
    }).catch(r => this.error = r.error.message)
  }

  // confirm booking payment
  confirmPayment(bookingId: number){
    this.db.confirmPayment(bookingId, this.user.getLoginToken()).then(r => {
      // update booking data
      this.loadBookings();
    }).catch(r => this.error = r.error.message)
  }
}
