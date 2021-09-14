import { Component, OnInit } from '@angular/core';
import { DbConnectionService } from '../services/db-connection.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {

  listings = []

  constructor(private db: DbConnectionService,
    private user: UserService) { }

  ngOnInit(): void {
    this.db.getAllListings(this.user.getUser().accessToken).then(l => this.listings = l['listings'])
  }

}
