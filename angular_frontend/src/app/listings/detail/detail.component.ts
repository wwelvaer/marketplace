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
      this.form = new FormGroup({
        numberOfAssets: new FormControl()
      })
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.db.getListing(params.id)
        .then(l => {
          this.listing = l
          if (this.listing['userID'] === this.user.getId())
            this.loadBookings();
        })
        .catch(err => this.error = err.error.message)
    })
  }

  loadBookings(){
    this.db.getListingBookings(this.listing['listingID'], this.user.getLoginToken())
              .then(b => this.bookings = b['bookings'])
              .catch(err => this.error = err.error.message)
  }

  deleteListing(id: number){
    this.db.deleteListing(id, this.user.getLoginToken()).then(_ => {
      this.location.back()
    })
  }

  createBooking(){
    let v = this.form.getRawValue()
    v['listingID'] = this.listing['listingID'];
    this.db.createBooking(this.user.getLoginToken(), v).then(_ => {
      this.router.navigate(['/listings'], {queryParams: { bookings: true }})
    })
  }

  cancelBooking(bookingId: number){
    this.db.cancelBooking(bookingId, this.user.getLoginToken()).then(r => {
      this.loadBookings();
    }).catch(r => this.error = r.error.message)
  }

  confirmPayment(bookingId: number){
    this.db.confirmPayment(bookingId, this.user.getLoginToken()).then(r => {
      this.loadBookings();
    }).catch(r => this.error = r.error.message)
  }
}
