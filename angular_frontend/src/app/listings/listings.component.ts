import { Component, OnInit } from '@angular/core';
import { DbConnectionService } from '../services/db-connection.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {
  selected: Date | null;
  listings = []
  searchTerm: string = "";
  sortCol: number = 4;
  sortCols = [
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

  pageLimitOption = [1, 10, 20, 50]
  pageLimitIndex = 1;
  currentPage = 1;

  maxPage = (listings) => Math.ceil(listings.length / this.pageLimitOption[this.pageLimitIndex])

  // lambda function that filters and sorts entries using searchTerm and searchCols
  filteredListings = () => this.listings
    .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 && (!this.selected || this.selected.getTime() >= new Date(u.startDate).setHours(0, 0, 0, 0)))
    .sort(this.sortCols[this.sortCol].sortFunc)

  constructor(private db: DbConnectionService,
    private user: UserService) { }

  ngOnInit(): void {
    this.db.getAllListings().then(l => this.listings = l['listings'])
  }

}
