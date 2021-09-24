import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbConnectionService } from './services/db-connection.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Marketplace';
  notifications: object[] = [];
  timeToRefresh = 5000;

  constructor(public user: UserService,
    private db: DbConnectionService,
    private router: Router){
      this.fetchNotifications();
      setInterval(() => {
        this.fetchNotifications();
      }, this.timeToRefresh);

  }

  getNotificationMessage(notification: object): string{
    switch (notification['type']) {
      case 'new transaction':
        return `A new transaction was made on your ${notification['transaction'].listing.name}`
      case 'cancellation':
        if (notification['transaction'].customerID === this.user.getId())
          return `Your transaction on ${notification['transaction'].listing.name} has been cancelled`
        else
          return `A transaction on your ${notification['transaction'].listing.name} has been cancelled`
      case 'payment confirmation':
        return `Your payment on ${notification['transaction'].listing.name} has been confirmed`
      default:
        break;
    }
  }

  clickedNotification(notification: object){
    this.db.markNotificationAsViewed(notification['notificationID'], this.user.getLoginToken()).then(_ => {
      switch (notification['type']) {
        case 'new transaction':
          this.router.navigate(['/listings/details', notification['transaction'].listingID])
          break;
        case 'cancellation':
          if (notification['transaction'].customerID === this.user.getId())
            this.router.navigate(['/listings'], {queryParams: { transactions: true }})
          else
            this.router.navigate(['/listings/details', notification['transaction'].listingID])
          break;
        case 'payment confirmation':
          this.router.navigate(['/listings'], {queryParams: { transactions: true }})
          break;
        default:
          break;
      }
    })
  }

  fetchNotifications() {
    if (this.user.isLoggedIn())
      this.db.getUserNotifications(this.user.getLoginToken()).then(r => this.notifications = r['notifications'].sort((a, b) => b['notificationID'] - a['notificationID']))
  }

  getUnreadNotificationsAmount(): number{
    return this.notifications.filter(x => !x['viewed']).length;
  }
}
