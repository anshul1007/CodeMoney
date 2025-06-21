// This is a test file to demonstrate import order enforcement
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { GameData } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private http = inject(HttpClient);

  getData(): Observable<GameData> {
    return this.http.get<GameData>('/test');
  }
}
