import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TwitterResponse } from './twitter.response.model';
import { environment } from '../../environments/environment';

@Injectable()
export class TwitterService {

  constructor(private http: HttpClient) { }

  user() {
    return this.http.get<TwitterResponse>(`${environment.api}/user`);
  }

  home(since?: string) {
    return this.http.get<TwitterResponse>(`${environment.api}/home?since=${since}`);
  }

  action(property: 'favorite'|'retweet', id: string, state: boolean) {
    return this.http.post<TwitterResponse>(`${environment.api}/${property}/${id}`, {state});
  }
}
