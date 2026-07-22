import { Injectable, inject, Type } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ModalComponent } from './modal-component';

interface OpenModal {
  close: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private overlay = inject(Overlay);

  private openModals = new Set<OpenModal>();

  addModal<TData, TResult>(component: Type<ModalComponent<TData, TResult>>, data?: TData): Observable<TResult> {
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().width('100%').height('100%'),
      hasBackdrop: true,
      backdropClass: 'pg-modal',
      panelClass: 'pg-modal-pane',
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const instance = overlayRef.attach(new ComponentPortal(component)).instance;
    this.assignData(instance, data);

    const result$ = new Subject<TResult>();
    const entry: OpenModal = { close: () => {} };

    entry.close = () => {
      if (!this.openModals.delete(entry)) {
        return;
      }
      keydownSub.unsubscribe();
      backdropSub.unsubscribe();
      result$.next(instance.result);
      result$.complete();
      overlayRef.dispose();
      this.toggleBodyClass();
    };
    instance._closeHandler = entry.close;

    const keydownSub = overlayRef.keydownEvents()
      .pipe(filter(event => event.key === 'Escape'))
      .subscribe(() => entry.close());
    const backdropSub = overlayRef.backdropClick().subscribe(() => entry.close());

    this.openModals.add(entry);
    this.toggleBodyClass();

    return result$.asObservable();
  }

  removeAll(): void {
    [...this.openModals].forEach(entry => entry.close());
  }

  private assignData(instance: any, data: any): void {
    if (!data) {
      return;
    }
    for (const key of Object.keys(data)) {
      if (data[key] && instance[key] && typeof data[key] === 'object' && typeof instance[key] === 'object') {
        Object.assign(instance[key], data[key]);
      } else {
        instance[key] = data[key];
      }
    }
  }

  private toggleBodyClass(): void {
    document.body.classList.toggle('modal-open', this.openModals.size > 0);
  }
}
