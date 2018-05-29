import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Tweet } from '../util/tweet.model';
import { TwitterService } from '../util/twitter.service';



@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html'
})
export class TweetsComponent implements OnInit, OnDestroy {
  inflight = false;
  tweets: Tweet[] = [];
  ids = [];
  timer;
  since = '';

  constructor(private twitter: TwitterService) {}

  ngOnInit() {
    this.getTweets();
    this.timer = setInterval(() => this.getTweets(), 50000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getTweets() {
    this.twitter.home(this.since).subscribe(tweets => {
      tweets.data.reverse().forEach(tweet => {
        if (this.ids.indexOf(tweet.id_str) < 0) {
          this.ids.push(tweet.id_str);
          this.tweets.unshift(tweet);
        }
      });
      this.since = this.tweets[0].id_str;
      this.cleanUp();
    });
  }

  cleanUp() {
    if (this.tweets.length > 100) {
      this.tweets.splice(100);
      this.ids.splice(100);
    }
  }

  action(action, index) {
    if (this.inflight) {
      return;
    }

    const stateKey = action.property === 'favorite' ? 'favorited' : 'retweeted';
    const newState = !action.tweet[stateKey];

    this.inflight = true;
    this.twitter.action(action.property, action.tweet.id_str, newState).subscribe(tweet => {
      this.tweets[index][stateKey] = newState;
      this.tweets[index][action.property + '_count'] += newState ? 1 : -1;
      this.inflight = false;
    });
  }
}
