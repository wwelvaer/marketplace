import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  info: string;

  constructor(public user: UserService,
    private route: Router) {
      if (!user.isLoggedIn())
        this.route.navigateByUrl("/login")
    }

  ngOnInit(): void {
    this.info = JSON.stringify(this.user.getUser());
  }

}
