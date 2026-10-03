import { Injectable, ViewContainerRef, ComponentRef, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private viewContainerRef?: ViewContainerRef;

  registerContainerRef(ref: ViewContainerRef): void {
    this.viewContainerRef = ref;
  }

  open<T>(component: Type<T>, config?: { data?: any }): ComponentRef<T> {
    if (!this.viewContainerRef) {
      throw new Error('ViewContainerRef not registered. Call DialogService.registerContainerRef() first.');
    }

    const componentRef = this.viewContainerRef.createComponent(component);
    const instance = componentRef.instance as any;

    if (config?.data) {
      Object.assign(instance, config.data);
      if ('data' in instance) {
        instance.data = config.data;
      }
    }

    if ('show' in instance) {
      instance.show = true;
    }

    if ('close' in instance) {
      instance.close.subscribe(() => {
        componentRef.destroy();
      });
    }

    return componentRef;
  }

  confirm(config: {
    title: string;
    message: string;
    confirmText?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: string;
    confirmVariant?: string;
  }): Observable<boolean> {
    const subject = new Subject<boolean>();
    const ref = this.open(ConfirmDialogComponent, {
      data: {
        title: config.title,
        message: config.message
      }
    });

    ref.instance.confirm.subscribe(() => {
      subject.next(true);
      subject.complete();
    });

    ref.instance.close.subscribe(() => {
      if (!subject.closed) {
        subject.next(false);
        subject.complete();
      }
    });

    return subject.asObservable();
  }
}
