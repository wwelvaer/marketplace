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
  transactions: boolean = false; // true ->  display transactionInfo; false -> display listingInfo
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
    let selectedCategories = this.categories.map(x => x[1]).reduce((acc, val) => acc.concat(val), []).filter(x => x.selected).map(x => x.name);
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
      this.categories = Object.entries(r).map(([k, v]) => [k, v.map((x => {
        return {name: x, selected: false}
      }))])
    })
    // get url query params
    this.route.queryParamMap.subscribe(qMap => {
      // when query has 'transactions' parameter display transactionInfo
      this.transactions = !!qMap['params'].transactions
      if (this.transactions)
        this.fetchTransactions();
      else {
        // when query has 'id' parameter display listings from user with id
        let uId = qMap['params'].id;
        if (uId)
            this.db.getUserListings(uId).then(l => this.listings = l['listings'])
        else
          this.db.getAllListings().then(l => this.listings = l['listings'])
      }
    })
  }

  // get transactions and sort recent to last
  fetchTransactions(){
    this.db.getUserTransactions(this.user.getLoginToken())
        .then(l => this.listings = l['transactions'].sort((a, b) => b.transactionID - a.transactionID).map(x => {return {...x, ...x.listing}}))
  }

  // delete listing
  deleteListing(id: number){
    this.db.deleteListing(id, this.user.getLoginToken()).then(_ => {
      // remove from list
      this.listings = this.listings.filter(x => x.listingID !== id)
    })
  }

  // cancel transaction
  cancelTransaction(transactionID: number){
    this.db.cancelTransaction(transactionID, this.user.getLoginToken())
      .then(_ => this.fetchTransactions()) // update transactionInfo
  }

}
