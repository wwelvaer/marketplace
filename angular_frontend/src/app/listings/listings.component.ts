import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {

  selected: Date | null; // calendar value
  listings = []
  categories = [];
  bookings: boolean = false; // true ->  display bookingInfo; false -> display listingInfo
  searchTerm: string = ""; // searchbar value
  sortCol: number = 4; // sort dropdown index value
  sortCols = [ // sort dropdown values + sort functions
    {
      name: 'Name: A -> Z',
      sortFunc: (a, b) => (a.name ? a.name : "").localeCompare(b.name ? b.name : "")
    }, {
      name: 'Name: Z -> A',
      sortFunc: (a, b) => -(a.name ? a.name : "").localeCompare(b.name ? b.name : "")
    }, {
      name: 'Available assets: Low -> High',
      sortFunc: (a, b) => a.availableAssets - b.availableAssets
    }, {
      name: 'Available assets: High -> Low',
      sortFunc: (a, b) => b.availableAssets - a.availableAssets
    }, {
      name: 'Start Date: Recent -> Oldest',
      sortFunc: (a, b) => -(a.startDate ? a.startDate : "").localeCompare(b.startDate ? b.startDate : "")
    }, {
      name: 'Start Date: Oldest -> Recent',
      sortFunc: (a, b) => (a.startDate ? a.startDate : "").localeCompare(b.startDate ? b.startDate : "")
    }, {
      name: 'Price: Low -> High',
      sortFunc: (a, b) => a.price - b.price
    }, {
      name: 'Price: High -> Low',
      sortFunc: (a, b) => b.price - a.price
    }];

  pageLimitOption = [10, 20, 50]
  pageLimitIndex = 1; // selected pageLimit index
  currentPage = 1;

  // lambda function that calculates last page
  maxPage = (listings) => Math.ceil(listings.length / this.pageLimitOption[this.pageLimitIndex])

  // function that filters by category and searchTerm and sorts entries using searchCols
  filteredListings = () => {
    let selectedCategories = this.categories.filter(x => x.selected).map(x => x.name);
    return this.listings
    .filter(l => selectedCategories.every(x => (l.categories).includes(x))) // categories
    .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 && (!this.selected || this.selected.getTime() >= new Date(u.startDate).setHours(0, 0, 0, 0)))
    .sort(this.sortCols[this.sortCol].sortFunc)
  }

  constructor(private db: DbConnectionService,
    private user: UserService,
    private route: ActivatedRoute,
    public image: ImageService) { }

  ngOnInit(): void {
    // get categories
    this.db.getCategories().then(r => {
      r['categories'].forEach(x => {
        x['selected'] = false;
        this.categories.push(x)
      });
    })
    // get url query params
    this.route.queryParamMap.subscribe(qMap => {
      // when query has 'bookings' parameter display bookingInfo
      this.bookings = !!qMap['params'].bookings
      if (this.bookings)
        this.fetchBookings();
      else {
        // when query has 'id' parameter display listings from user with id
        let uId = qMap['params'].id;
        if (uId)
            this.db.getUserListings(uId).then(l => {console.log(l); return this.listings = l['listings']})
        else
          this.db.getAllListings().then(l => this.listings = l['listings'])
      }
    })
  }

  // get bookings and sort recent to last
  fetchBookings(){
    this.db.getUserBookings(this.user.getLoginToken())
        .then(l => this.listings = l['bookings'].sort((a, b) => b.bookingID - a.bookingID).map(x => {return {...x, ...x.listing}}))
  }

  // delete listing
  deleteListing(id: number){
    this.db.deleteListing(id, this.user.getLoginToken()).then(_ => {
      // remove from list
      this.listings = this.listings.filter(x => x.listingID !== id)
    })
  }

  // cancel booking
  cancelBooking(bookingID: number){
    this.db.cancelBooking(bookingID, this.user.getLoginToken())
      .then(_ => this.fetchBookings()) // update bookingInfo
  }

}
