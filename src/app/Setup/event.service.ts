import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventData = new Subject();
  progressBarTimerSource$ = this.eventData.asObservable();

constructor() { }
emitdata(message: any) {
  this.eventData.next(message);
}

}
