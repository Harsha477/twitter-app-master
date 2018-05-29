import { Component, OnInit } from '@angular/core';
import { TwitterService } from './util/twitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: any;

  constructor(private twitter: TwitterService) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.twitter.user().subscribe(user => this.user = user.data);
  }
}
