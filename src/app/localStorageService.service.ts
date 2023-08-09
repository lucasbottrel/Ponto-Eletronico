import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  private startTimeKey = 'startTime';
  private lunchTimeKey = 'lunchTime';
  private lunchEndTimeKey = 'lunchEndTime';
  private endTimeKey = 'endTime';
  private timesumKey = 'timesum';

  saveData(startTime: Date, lunchTime: Date, lunchEndTime: Date, endTime: Date, timesumKey: string): void {
    localStorage.setItem(this.startTimeKey, JSON.stringify(startTime));
    localStorage.setItem(this.lunchTimeKey, JSON.stringify(lunchTime));
    localStorage.setItem(this.lunchEndTimeKey, JSON.stringify(lunchEndTime));
    localStorage.setItem(this.endTimeKey, JSON.stringify(endTime));
    localStorage.setItem(this.timesumKey, JSON.stringify(timesumKey));
  }

  getData(): any {
    const startTime = localStorage.getItem(this.startTimeKey);
    const lunchTime = localStorage.getItem(this.lunchTimeKey);
    const lunchEndTime = localStorage.getItem(this.lunchEndTimeKey);
    const endTime = localStorage.getItem(this.endTimeKey);
    const timesum = localStorage.getItem(this.timesumKey);

    return JSON.parse('{ "startTime": ' + startTime + ', "lunchTime": ' + lunchTime + ', "lunchEndTime": ' + lunchEndTime + ', "endTime": ' + endTime + ', "timesum": ' + timesum + ' }');
  }

  clearData(): void {
    localStorage.removeItem(this.startTimeKey);
    localStorage.removeItem(this.lunchTimeKey);
    localStorage.removeItem(this.lunchEndTimeKey);
    localStorage.removeItem(this.endTimeKey);
    localStorage.removeItem(this.timesumKey);
  }
}
