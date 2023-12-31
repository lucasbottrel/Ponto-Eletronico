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
  private commentKey = 'comment';

  saveComment(comment: string): void {
    localStorage.setItem(this.commentKey, JSON.stringify(comment));
  }

  saveData(startTime: Date | null, lunchTime: Date | null, lunchEndTime: Date | null, endTime: Date | null, timesumKey: string): void {
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
    const comment = localStorage.getItem(this.commentKey);

    return JSON.parse('{ "startTime": ' + startTime + ', "lunchTime": ' + lunchTime + ', "lunchEndTime": ' + lunchEndTime + ', "endTime": ' + endTime + ', "timesum": ' + timesum + ', "comment": ' + comment + ' }');
  }

  clearData(): void {
    localStorage.removeItem(this.startTimeKey);
    localStorage.removeItem(this.lunchTimeKey);
    localStorage.removeItem(this.lunchEndTimeKey);
    localStorage.removeItem(this.endTimeKey);
    localStorage.removeItem(this.timesumKey);
  }
}
