import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  listing: object;
  error: string;

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.db.getListing(params.id)
        .then(l => this.listing = l)
        .catch(err => this.error = err.error.message)
    })
  }

  deleteListing(id: number){
    this.db.deleteListing(id, this.user.getLoginToken()).then(_ => {
      this.location.back()
    })
  }

}
