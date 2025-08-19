import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notification: NzNotificationService) { }

  success(title: string, content: string, durationMs = 0): void {
    this.notification.success(title, content, {
      nzDuration: durationMs,
    });
  }

  error(title: string, content: string, durationMs = 0): void {
    this.notification.error(title, content, {
      nzDuration: durationMs,
    });
  }

  info(title: string, content: string, durationMs = 0): void {
    this.notification.info(title, content, {
      nzDuration: durationMs,
    });
  }

  warning(title: string, content: string, durationMs = 0): void {
    this.notification.warning(title, content, {
      nzDuration: durationMs,
    });
  }
}
