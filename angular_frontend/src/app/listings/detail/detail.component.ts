import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  listing: object;

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.db.getListing(params.id).then(l => this.listing = l)
    })
  }

}
